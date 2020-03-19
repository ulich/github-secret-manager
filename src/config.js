const githubAccessToken = requiredEnvVar('GITHUB_PERSONAL_ACCESS_TOKEN')
const githubOrganization = requiredEnvVar('TARGET_GITHUB_ORG')
const secretsToSpread = requiredEnvVar('SECRETS_TO_SPREAD').split(',')
const secrets = collectSecrets(secretsToSpread)
const repoWhitelist = optionalEnvVarAsList('TARGET_REPOSITORIES_WHITELIST')
const repoBlacklist = optionalEnvVarAsList('TARGET_REPOSITORIES_BLACKLIST')

function requiredEnvVar(name) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Environment variable ${name} must be provided`)
  }
  return value
}

function optionalEnvVarAsList(name) {
  const value = process.env[name]
  if (!value) {
    return null
  }
  return value.split(',')
}

function collectSecrets(secretsToSpread) {
  const secrets = {}
  for (let name of secretsToSpread) {
    secrets[name] = requiredEnvVar(name)
  }
  return secrets
}

module.exports = {
  githubAccessToken,
  githubOrganization,
  repoWhitelist,
  repoBlacklist,
  secrets,
}
