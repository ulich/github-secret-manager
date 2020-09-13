# github-secret-manager

Simplifies managing your GitHub secrets for GitHub Actions. You can specify secrets in one central repository and it will spread the secrets to all other repositories of that GitHub organization.

*Note*: In the meantime, GitHub implemented organization-wide secrets making this project obsolete as of now. There are some ideas like rotating secrets that would still be nice to have, that's why I am keeping the project.

## Usage

Whenever you create a new repository, trigger a build on this repository to spread the secrets by star'ing and un-star'ing this repository. Currently there is no better way to manually trigger a build with GitHub actions, see [workaround](https://dev.to/s_abderemane/manual-trigger-with-github-actions-279e).

## Setting it up

[Duplicate](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/duplicating-a-repository) this repository (you can also fork it but this would require you to set your fork as public which might not be desired for such a sensitive topic).

Then create a GitHub workflow by copying the example

    cd .github/workflows
    cp master.yml.example master.yml

and configure the environment variables to your needs.

### Configuration

* **GITHUB_PERSONAL_ACCESS_TOKEN**: Create a [personal access token](https://github.com/settings/tokens) for a user who has access to the **TARGET_GITHUB_ORG** and configure it to have **full private repositories access** and **workflow** access. You should store the token as a secret in this repository and reference it accordingly like in the example. Unfortunately, you cannot use the `GITHUB_TOKEN` secret provided by GitHub, due to [this](https://help.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token)
* **TARGET_GITHUB_ORG**: By default, the secrets will be spread to all repositories of this GitHub organization. Use **TARGET_REPOSITORIES_WHITELIST** or **TARGET_REPOSITORIES_BLACKLIST** to not spread secrets to all repositories
* **TARGET_REPOSITORIES_WHITELIST**: A comma separated list of repository names of the GitHub organization where secrets should be spread to
* **TARGET_REPOSITORIES_BLACKLIST**: A comma separated list of repository names of the GitHub organization where secrets should NOT be spread to
* **SECRETS_TO_SPREAD**: A comma separated list of secret names that should be spread. For every secret name in this list, configure a secret in this repository and create an environment variable with the same name


## Pulling new features from this repository

As usual with forks, just pull the latest changes from https://github.com/ulich/github-secret-manager `master` branch. If you duplicated the repository instead of forking, you can run

    git remote add upstream https://github.com/ulich/github-secret-manager.git
    git pull upsteam master
