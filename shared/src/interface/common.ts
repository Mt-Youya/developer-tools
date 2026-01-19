export type SemanticVersion = `${number}.${number}.${number}`
export type PreReleaseTag = "alpha" | "beta" | "rc"
export type PreReleaseVersion = `${SemanticVersion}-${PreReleaseTag}.${number}`
export type VersionString = SemanticVersion | PreReleaseVersion

export type HTTPAdress = `http://${string}`
export type HTTPSAdress = `https://${string}`
export type URLAdress = HTTPAdress | HTTPSAdress
export type EmailAddress = `${string}@${string}.${string}`
export type SSHGit = `ssh://git@${string}.git`
export type Owner = string
export type Env = "prod" | "test"
export type DevicePlatform = "Android" | "iOS" | "HarmonyOS" | "Web" | "all"
