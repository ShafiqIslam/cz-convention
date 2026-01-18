const updateNotifier = require("update-notifier").default;
const pkg = require("./package.json");
const prompts = require("prompts");
const { execSync } = require("child_process");

async function update() {
  const notifier = updateNotifier({
    pkg,
    updateCheckInterval: 1000 * 60 * 60, // 1 hour * 24, // 1 day
  });

  if (!notifier.isGlobal) {
    return;
  }

  if (notifier.update) {
    await _promptForUpdate(notifier.update);
  }
}

async function _promptForUpdate(update) {
  console.log(
    `\nUpdate available ${pkg.name}@${update.current} → ${update.latest}`,
  );

  const { shouldUpdate } = await prompts({
    type: "confirm",
    name: "shouldUpdate",
    message: "Update now?",
    initial: true,
  });

  if (shouldUpdate) {
    _doUpdate();
  }
}

function _doUpdate() {
  try {
    console.log(`Updating ${pkg.name}...`);
    execSync(`npm i -g ${pkg.name}`, { stdio: "inherit" });
    console.log("Update complete ✔\n");
  } catch (err) {
    console.error("\nUpdate failed. Run manually:");
    console.error(`npm i -g ${pkg.name}\n`);
  }
}

module.exports = {
  update: update,
};
