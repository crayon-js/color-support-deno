import { CrayonColorSupport } from './types.ts'

let textDecoder: TextDecoder

let trueColor = false
let highColor = false
let threeBitColor = false
let fourBitColor = false

export const supportedColors = (): CrayonColorSupport => ({
	trueColor,
	highColor,
	threeBitColor,
	fourBitColor,
})

export const getWindowsVersion = (): number[] => {
	if (Deno.build.os == 'windows') {
		// (window.Deno.core as any).opSync("op_os_release");
		const [version, , versionId] = Deno.osRelease().split('.')
		return [Number(version), Number(versionId)]
	}
	return []
}

const CIs = [
	'TRAVIS',
	'CIRCLECI',
	'GITHUB_ACTIONS',
	'GITLAB_CI',
	'BUILDKITE',
	'DRONE',
	'APPVEYOR',
]

export const getColorSupport = async (config?: {
	requestPermissions?: boolean
	forcePermissions?: boolean
}): Promise<CrayonColorSupport> => {
	if (config?.forcePermissions) Deno.env.get('')
	else if (config?.requestPermissions)
		await Deno.permissions.request({ name: 'env' })

	if ((await Deno.permissions.query({ name: 'env' })).state === 'granted') {
		if (Deno.env.get('NO_COLOR')) {
			threeBitColor = fourBitColor = highColor = trueColor = false
			return supportedColors()
		}

		switch (Deno.env.get('COLORTERM')) {
			case 'truecolor':
				threeBitColor = fourBitColor = highColor = trueColor = true
				return supportedColors()
			// are there other settings for that variable?
		}

		if (/-?256(color)?/gi.test(Deno.env.get('TERM') || '')) {
			fourBitColor = highColor = true
			return supportedColors()
		}

		if (Deno.env.get('CI') && CIs.some((CI) => !!Deno.env.get(CI))) {
			threeBitColor = fourBitColor = true
			return supportedColors()
		}

		if (Deno.env.get('COLORTERM')) {
			threeBitColor = fourBitColor = true
			return supportedColors()
		}
	}

	const winVersion = getWindowsVersion()
	if (winVersion.length) {
		// https://devblogs.microsoft.com/commandline/24-bit-color-in-the-windows-console/
		threeBitColor = fourBitColor = highColor = trueColor = winVersion[1] > 14931
		return supportedColors()
	}

	textDecoder ||= new TextDecoder()

	if (config?.forcePermissions)
		Deno.run({
			cmd: [],
		})
	else if (config?.requestPermissions)
		await Deno.permissions.request({ name: 'run' })

	if ((await Deno.permissions.query({ name: 'run' })).state === 'granted') {
		const tputColors =
			Number(
				textDecoder.decode(
					await Deno.run({
						cmd: ['tput', 'colors'],
					}).output()
				)
			) || 0

		threeBitColor = tputColors >= 4 || threeBitColor
		fourBitColor = tputColors >= 8 || fourBitColor
		highColor = tputColors >= 256 || highColor
		trueColor = tputColors >= 16777216 || trueColor
		return supportedColors()
	}

	return supportedColors()
}
