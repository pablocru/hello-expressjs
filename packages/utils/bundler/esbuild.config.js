#!/usr/bin/env node

import * as esbuild from "esbuild";
import pkg from "@sprout2000/esbuild-copy-plugin";

// Types ---------------------------------------------------------------------------------

/**
 * @typedef {Object} ProgramConfig
 * @property {string} entryPoint - The path to the entry point file
 * @property {string} [outFile] - The output file path
 * @property {string} [outDir] - The output directory path. It will be ignored if
 * `outFile` is provided.
 * @property {string} [copyFrom] - Copy target
 * @property {string} [copyTo] - Copy destination
 * @property {boolean} [isWatchEnabled] - Whether to enable watch mode
 */

// Constants -----------------------------------------------------------------------------

const ArgumentKeys = {
  EntryPoint: "--input",
  OutFile: "--output",
  Copy: "--copy",
  WatchEnabled: "--watch",
};

// Main Program --------------------------------------------------------------------------

const programConfig = getProgramConfig(process.argv.slice(2));

try {
  await bundleHandler(programConfig);
} catch (error) {
  if (error instanceof Error) {
    const { message } = error;
    console.error(message);
  } else {
    console.error("Unknown error:", error);
  }
}

// Functions -----------------------------------------------------------------------------

/**
 * @param {ProgramConfig} programConfig
 */
async function bundleHandler({
  entryPoint,
  isWatchEnabled,
  copyFrom,
  copyTo,
  outDir,
  outFile,
}) {
  /** @type {esbuild.BuildOptions} */
  const buildOptions = {
    entryPoints: [entryPoint],
    bundle: true,
    minify: true,
    outdir: outDir,
    format: "esm",
    packages: "external",
    platform: "node",
  };

  if (isStringAndIsFilled(outFile)) {
    buildOptions.outfile = outFile;
  }

  if (copyFrom && copyTo) {
    if (!buildOptions.plugins) {
      buildOptions.plugins = [];
    }
    buildOptions.plugins.push(pkg.copyPlugin({ src: copyFrom, dest: copyTo }));
  }

  if (isWatchEnabled) {
    const ctx = await esbuild.context(buildOptions);
    console.log("Watching for changes...\n");
    await ctx.watch();
  } else {
    await esbuild.build(buildOptions);
    console.log("Process complete.\n");
  }
}

/**
 * @param {string[]} args
 * @returns {ProgramConfig}
 */
function getProgramConfig(args) {
  return args.reduce(
    (config, arg) => {
      const [key, value] = arg.split("=");

      if (isValidKeyAndIsFilled(key)) {
        switch (key) {
          case ArgumentKeys.EntryPoint:
            if (isStringAndIsFilled(value)) config.entryPoint = value;
            break;
          case ArgumentKeys.OutFile:
            if (isStringAndIsFilled(value)) {
              config.outDir = undefined;
              config.outFile = value;
            }
            break;
          case ArgumentKeys.Copy: {
            if (isStringAndIsFilled(value)) {
              const copyPathList = getCopyPathListIfIsValid(value);

              if (copyPathList) {
                const [from, to] = copyPathList;

                config.copyFrom = from;
                config.copyTo = to;
              }
            }
            break;
          }
          case ArgumentKeys.WatchEnabled:
            config.isWatchEnabled = true;
            break;
          default:
            break;
        }
      }

      return config;
    },
    {
      entryPoint: "src/index.js",
      outDir: "dist",
    }
  );
}

/**
 * @param {unknown} thePathList
 * @returns {string[] | undefined}
 */
function getCopyPathListIfIsValid(thePathList) {
  if (!isStringAndIsFilled(thePathList)) return;

  const pathList = thePathList.split(",", 2);

  for (const path of pathList) {
    if (!isStringAndIsFilled(path)) return;
  }

  return pathList;
}

/** @param {unknown} key */
function isValidKeyAndIsFilled(key) {
  return isStringAndIsFilled(key) && Object.values(ArgumentKeys).includes(key);
}

/** @param {unknown} string */
function isStringAndIsFilled(string) {
  return Boolean(string && typeof string === "string" && string.length);
}
