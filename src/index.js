const { Octokit } = require('@octokit/rest')
const sodium = require('tweetsodium')
const config = require('./config')

const octokit = new Octokit({
  auth: config.githubAccessToken
});

main()
async function main() {
  const repos = await octokit.paginate(`GET /orgs/${config.githubOrganization}/repos`)

  for (let repo of repos) {
    if (config.repoBlacklist != null && config.repoBlacklist.includes(repo.name)) {
      console.log(`Skipping ${config.githubOrganization}/repo, it is blacklisted`)
      continue
    }

    if (config.repoWhitelist != null && !config.repoWhitelist.includes(repo.name)) {
      console.log(`Skipping ${config.githubOrganization}/repo, it is not in the whitelist`)
      continue
    }

    const { data: publicKey } = await octokit.request(`GET /repos/${config.githubOrganization}/${repo.name}/actions/secrets/public-key`)

    for (let [secretName, secretValue] of Object.entries(config.secrets)) {
      await updateSecret(repo.name, secretName, secretValue, publicKey)
    }
  }
}

async function updateSecret(repoName, secretName, secretValue, publicKey) {
  const encryptedSecret = encrypt(secretValue, publicKey.key)

  console.log('Setting secret', secretName, 'on', `${config.githubOrganization}/${repoName}`)

  await octokit.actions.createOrUpdateSecretForRepo({
    owner: config.githubOrganization,
    repo: repoName,
    name: secretName,
    key_id: publicKey.key_id,
    encrypted_value: encryptedSecret
  })
}

function encrypt(payload, publicKey) {
  const payloadBytes = Buffer.from(payload)
  const keyBytes = Buffer.from(publicKey, 'base64')

  const encrypted = sodium.seal(payloadBytes, keyBytes)

  return Buffer.from(encrypted).toString('base64')
}
