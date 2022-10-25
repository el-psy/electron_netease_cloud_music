import fs from "fs";
import { normalizePath } from "vite";
import path from "path";
import fastGlob from "fast-glob";
import { watch } from "chokidar";
import { transform } from "esbuild";
function debounce(fn, delay = 299) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}
const colours = {
  $_$: (c) => (str) => `\x1B[${c}m` + str + "\x1B[0m",
  gary: (str) => colours.$_$(90)(str),
  cyan: (str) => colours.$_$(36)(str),
  yellow: (str) => colours.$_$(33)(str),
  green: (str) => colours.$_$(32)(str),
  red: (str) => colours.$_$(31)(str)
};
const JS_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx"];
const STATIC_JS_EXTENSIONS = [".json", ".node", ".wasm"];
function ensureDir(filename) {
  const dir = path.dirname(filename);
  !fs.existsSync(dir) && fs.mkdirSync(dir, { recursive: true });
  return filename;
}
function jsType(filename) {
  return {
    js: !filename.endsWith(".d.ts") && JS_EXTENSIONS.some((ext) => filename.endsWith(ext)),
    static: STATIC_JS_EXTENSIONS.some((ext) => filename.endsWith(ext))
  };
}
function log(type, ...message) {
  const dict = {
    error: "red",
    info: "cyan",
    success: "green",
    warn: "yellow"
  };
  message = message.map((msg) => colours[dict[type]](msg));
  console.log(...message);
}
const logger = {
  error: (...message) => log("error", ...message),
  info: (...message) => log("info", ...message),
  success: (...message) => log("success", ...message),
  warn: (...message) => log("warn", ...message),
  log: (...message) => console.log(...message)
};
function resolvePlugins(config) {
  var _a;
  return [
    esbuild(),
    startup(),
    ...(_a = config.plugins) != null ? _a : []
  ];
}
function esbuild() {
  let config;
  return {
    name: ":esbuild",
    configResolved(_config) {
      config = _config;
    },
    transform({ filename, code }) {
      const { transformOptions } = config;
      return transform(code, {
        loader: path.extname(filename).slice(1),
        ...transformOptions
      });
    }
  };
}
function startup() {
  let config;
  let startup2;
  const files = [];
  return {
    name: ":startup",
    configResolved(_config) {
      const { command, viteDevServer, _fn } = config = _config;
      if (command === "serve") {
        startup2 = debounce(function startup_fn() {
          const ispreload = config.extensions.some((ext) => files.every((file) => file.endsWith("preload" + ext)));
          files.length = 0;
          if (ispreload) {
            viteDevServer.ws.send({ type: "full-reload" });
          } else {
            _fn.startup();
            logger.log(colours.green("[startup]"), "Electron App");
          }
        });
      }
    },
    ondone({ filename }) {
      if ((config == null ? void 0 : config.command) === "serve") {
        files.push(filename);
        startup2();
      }
    }
  };
}
async function resolveConfig(config, command, viteDevServer = null) {
  var _a, _b, _c;
  (_b = (_a = process._resolved_config) == null ? void 0 : _a.watcher) == null ? void 0 : _b.close();
  const {
    root,
    include,
    outDir,
    transformOptions
  } = config;
  const resolvedRoot = normalizePath(
    root ? path.resolve(root) : process.cwd()
  );
  const defaultOutDir = normalizePath(outDir != null ? outDir : "dist-electron");
  const resolved = {
    plugins: resolvePlugins(config),
    root: resolvedRoot,
    include: include,
    outDir: path.posix.resolve(resolvedRoot, defaultOutDir),
    transformOptions: Object.assign({
      target: "node14",
      format: "cjs"
    }, transformOptions),
    config,
    command,
    extensions: JS_EXTENSIONS,
    watcher: null,
    viteDevServer,
    _fn: {
      async startup(args = [".", "--no-sandbox"]) {
        const { spawn } = await import("child_process");
        const electronPath = (await import("electron")).default;
        if (process.electronApp) {
          process.electronApp.removeAllListeners();
          process.electronApp.kill();
        }
        process.electronApp = spawn(electronPath, args, { stdio: "inherit" });
        process.electronApp.once("exit", process.exit);
      },
      include2files,
      include2globs,
      replace2dist: (filename, replace2js) => input2output(resolved, filename, replace2js)
    }
  };
  if (command === "serve") {
    resolved.watcher = watch(include2globs(resolved.include));
  }
  for (const plugin of resolved.plugins) {
    await ((_c = plugin.configResolved) == null ? void 0 : _c.call(plugin, resolved));
  }
  return process._resolved_config = resolved;
}
function include2files(config, include = config.include) {
  return fastGlob.sync(include2globs(include), { cwd: config.root }).filter((p) => config.extensions.includes(path.extname(p))).map((file) => normalizePath(file));
}
function include2globs(files) {
  // const { root } = config;
  return files.map((p) => {
    try {
      const stat = fs.statSync(p);
      if (stat.isDirectory()) {
        return path.posix.join(p, "**/*");
      }
    } catch {
    }
    return p;
  });
}
function input2output(config, filename, replace2js = false) {
  filename = normalizePath(filename);
  const { root, outDir } = config;
  if (input2output.reduce1level === false) {
    input2output.reduce1level = include2files(config).map((file2) => file2.replace(root + "/", "")).every((file2) => file2.includes("/"));
  }
  const file = filename.replace(root + "/", "");
  const distname = path.posix.join(
    '',
    input2output.reduce1level ? file.slice(file.indexOf("/") + 1) : file
  );
  const extname = path.extname(distname);
  return replace2js && config.extensions.includes(extname) ? distname.replace(extname, ".js") : distname;
}
input2output.reduce1level = false;
async function build(config, filename) {
  var _a;
  const { _fn, plugins } = config;
  const distname = _fn.replace2dist(filename, true);
  if (distname === filename) {
    logger.log(
      colours.yellow("Input and output are the same file\n "),
      filename,
      "->",
      distname
    );
  } else {
    // ensureDir(distname);
    let code = fs.readFileSync(filename, "utf8");
    let done = false;
    for (const plugin of plugins) {
      if (done)
        break;
      const result = await ((_a = plugin.transform) == null ? void 0 : _a.call(plugin, {
        filename,
        code,
        done() {
          done = true;
        }
      }));
      if (!result)
        continue;
      if (typeof result === "string") {
        code = result;
      } else if (result !== null && typeof result === "object") {
        if (result.warnings.length) {
          logger.warn(result.warnings.map((e) => e.text).join("\n"));
        }
        code = result.code;
        if (result.map) {
          const map = JSON.parse(result.map);
          const parsed = path.parse(distname);
          map.file = parsed.base;
          map.sources = [path.relative(parsed.dir, filename)];
          fs.writeFileSync(distname + ".map", JSON.stringify(map));
          code += `
//# sourceMappingURL=${path.basename(distname)}.map`;
        }
      }
    }
    fs.writeFileSync(distname, code);
    logger.log(
      colours.cyan("[write]"),
      colours.gary(new Date().toLocaleTimeString()),
      `${distname}`
    );
  }
}
async function bootstrap(config, server) {
  process.env.VITE_DEV_SERVER_URL = resolveEnv(server).url;
  const resolved = await resolveConfig(config, "serve", server);
  const {
    _fn,
    watcher,
    plugins
  } = resolved;
  watcher.on("all", async (event, _filepath) => {
    var _a, _b;
    const filepath = normalizePath(_filepath);
    const distpath = _fn.replace2dist(filepath, true);
    const js_type = jsType(filepath);
    let run_done = false;
    for (const plugin of plugins) {
      (_a = plugin.onwatch) == null ? void 0 : _a.call(plugin, event, filepath);
    }
    switch (event) {
      case "add":
      case "change": {
        if (js_type.js) {
          await build(resolved, filepath);
        } else if (js_type.static) {
          fs.copyFileSync(filepath, ensureDir(distpath));
        }
        run_done = js_type.js || js_type.static;
        break;
      }
      case "addDir":
        break;
      case "unlink":
        if (fs.existsSync(distpath)) {
          fs.unlinkSync(distpath);
          run_done = js_type.js || js_type.static;
        }
        break;
      case "unlinkDir":
        fs.existsSync(distpath) && fs.rmSync(distpath, { recursive: true, force: true });
        break;
    }
    if (run_done) {
      run_done = false;
      for (const plugin of plugins) {
        (_b = plugin.ondone) == null ? void 0 : _b.call(plugin, { filename: filepath, distname: distpath });
      }
    }
  });
}
function resolveHostname(hostname) {
  const loopbackHosts = /* @__PURE__ */ new Set([
    "localhost",
    "127.0.0.1",
    "::1",
    "0000:0000:0000:0000:0000:0000:0000:0001"
  ]);
  const wildcardHosts = /* @__PURE__ */ new Set([
    "0.0.0.0",
    "::",
    "0000:0000:0000:0000:0000:0000:0000:0000"
  ]);
  return loopbackHosts.has(hostname) || wildcardHosts.has(hostname) ? "localhost" : hostname;
}
function resolveEnv(server) {
  const addressInfo = server.httpServer.address();
  const isAddressInfo = (x) => x == null ? void 0 : x.address;
  if (isAddressInfo(addressInfo)) {
    const { address, port } = addressInfo;
    const hostname = resolveHostname(address);
    const options = server.config.server;
    const protocol = options.https ? "https" : "http";
    const devBase = server.config.base;
    const path2 = typeof options.open === "string" ? options.open : devBase;
    const url = path2.startsWith("http") ? path2 : `${protocol}://${hostname}:${port}${path2}`;
    return { url, hostname, port };
  }
}
const name = "vite-electron-plugin";
function defineConfig(config) {
  return config;
}
function electron(config) {
  return [
    {
      name: `${name}:serve`,
      apply: "serve",
      async configureServer(server) {
        server.httpServer.on("listening", () => bootstrap(config, server));
      }
    },
    {
      name: `${name}:build`,
      apply: "build",
      config(_config) {
        electronConfigPreset(_config);
      },
      async closeBundle() {
        var _a;
        const resolved = await resolveConfig(config, "build");
        const { _fn, plugins } = resolved;
        for (const filename of _fn.include2files(resolved)) {
          const js_type = jsType(filename);
          const distname = _fn.replace2dist(filename, true);
          if (js_type.js) {
            await build(resolved, filename);
          } else if (js_type.static) {
            fs.copyFileSync(filename, ensureDir(distname));
          }
          if (js_type.js || js_type.static) {
            for (const plugin of plugins) {
              (_a = plugin.ondone) == null ? void 0 : _a.call(plugin, { filename, distname });
            }
          }
        }
      }
    }
  ];
}
function electronConfigPreset(config) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  (_a = config.base) != null ? _a : config.base = "./";
  (_b = config.build) != null ? _b : config.build = {};
  (_d = (_c = config.build).assetsDir) != null ? _d : _c.assetsDir = "";
  (_f = (_e = config.build).cssCodeSplit) != null ? _f : _e.cssCodeSplit = false;
  (_h = (_g = config.build).emptyOutDir) != null ? _h : _g.emptyOutDir = false;
  return config;
}
export {
  electron as default,
  defineConfig
};
