import { ConfigPlugin } from '@expo/config-plugins'
import { withAndroidManifest, withAppBuildGradle } from '@expo/config-plugins/build/plugins/android-plugins.js'

const withAndroidSigningConfig: ConfigPlugin = (config) => {
  config = withAndroidManifest(config, (config: any) => {
    const app = config.modResults.manifest.application?.[0]
    if (app && app.$['android:extractNativeLibs'] !== 'true') {
      app.$['android:extractNativeLibs'] = 'true'
    }
    return config
  })

  return withAppBuildGradle(config, (config) => {
    let contents = config.modResults.contents

    // Add abiCodes if not present
    if (!contents.includes('ext.abiCodes')) {
      contents = contents.replace(
        'android {',
        `ext.abiCodes = [x86:1, x86_64:2, 'armeabi-v7a':3, 'arm64-v8a': 4]

android {`,
      )
    }

    // Replace locales with b+ prefix if not already prefixed
    if (contents.includes('"zh-Hans"') && !contents.includes('"b+zh+Hans"')) {
      contents = contents.replace('"zh-Hans"', '"b+zh+Hans"')
    }
    if (contents.includes('"pt-BR"') && !contents.includes('"b+pt+BR"')) {
      contents = contents.replace('"pt-BR"', '"b+pt+BR"')
    }

    // Remove signingConfig from release if it's pointing to debug
    contents = contents.replace(
      /release \{([\s\S]*?)signingConfig signingConfigs\.debug/,
      `release {$1`,
    )

    // Add dependenciesInfo and splits if not present
    if (!contents.includes('dependenciesInfo {')) {
      contents = contents.replace(
        /androidResources \{([\s\S]*?)}/,
        `androidResources {$1}
    dependenciesInfo {
        includeInApk = false
        includeInBundle = false
    }
    splits {
        abi {
            reset()
            enable true
            universalApk false
            include project.ext.abiCodes.keySet() as String[]
        }
    }
    android.applicationVariants.configureEach { variant ->
        variant.outputs.each { output ->
            def baseAbiVersionCode = project.ext.abiCodes.get(output.getFilter(com.android.build.OutputFile.ABI))
            if (baseAbiVersionCode != null) {
                output.versionCodeOverride = (100 * project.android.defaultConfig.versionCode) + baseAbiVersionCode
            }
        }
    }`,
      )
    }

    config.modResults.contents = contents
    return config
  })
}

export default withAndroidSigningConfig
