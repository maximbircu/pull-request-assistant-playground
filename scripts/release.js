const fs = require('fs')
const exec = require('child_process').exec
const execSync = require('child_process').execSync

const main = () => {
    const releaseVersion = parseReleaseVersion()
    buildArtifacts()
    pushArtifacts()
    updateVersionName(releaseVersion)
}

const updateVersionName = (releaseVersion) => {
    const newVersion = incrementPatch(releaseVersion)
    execute('git checkout master')
    execute(`git checkout -b update-version-to-${newVersion}`)
    setVersionNameToPackageJson(newVersion)
    updateChangelog(releaseVersion)
    execute('git add .')
    execute('git commit -m "Update version name"')
    execute('git push"')
}

const parseReleaseVersion = () => {
    const currentBranchName = executeSync('git rev-parse --abbrev-ref HEAD')
    const branchVersionName = currentBranchName.split('-')[1]
    const projectVersionName = executeSync(
        `awk '/version/{gsub(/("|",)/,"",$2);print $2}' package.json`
    )

    if (branchVersionName !== projectVersionName) {
        setVersionNameToPackageJson(branchVersionName)
    }
    return branchVersionName
}

const buildArtifacts = () => {
    execute('yarn clean')
    execute('yarn build')
}

const pushArtifacts = () => {
    execute('git config --global user.name "maximbircu"')
    execute('git config --global user.name "maximbircu@users.noreply.github.com"')
    execute('git add --force dist/')
    execute('git commit -m "Add new artifacts"')
    execute('git push')
    // TODO create and push an annotated tag here
}

const setVersionNameToPackageJson = (newVersion) => {
    const data = fs.readFileSync(`package.json`, 'utf8')
    const newData = data.replace(/"version":.*"(.*)"/, `"version": "${newVersion}"`)
    fs.writeFileSync(
        'package.json',
        newData,
        'utf8'
    )
}

const updateChangelog = (versionName) => {
    const date = new Date()
    const dateText = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    const changelogData = fs.readFileSync(`CHANGELOG.md`, 'utf8')
    const newChangelogData = changelogData.replace(
        /## \*\(In development\)\*/,
        `## *(In development)*\n\n## Version ${versionName} *${dateText}*`
    )
    fs.writeFileSync(
        'CHANGELOG.md',
        newChangelogData,
        'utf8'
    )
}

const incrementPatch = (versionName) => {
    const versionParts = versionName.split('.')
    return `${versionParts[0]}.${versionParts[1]}.${parseInt(versionParts[2]) + 1}`
}

// Bash Utils
const execute = (command) => {
    exec(command, (error, stdout, stderr) => {
        if (stdout) console.log(stdout)
        if (stderr) console.log(stderr)
        if (error !== null) {
            console.log('exec error: ' + error)
        }
    })
}

const executeSync = (command) => {
    return execSync(command, { encoding: 'utf-8' }).trimEnd()
}

main()

