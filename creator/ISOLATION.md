# Creator runtime isolation evidence

## Observed source behavior

- Goose v1.56.0 `crates/goose/src/providers/codex_acp.rs` resolves `codex-acp` from its search path and maps **both** `GOOSE_MODE=chat` and `GOOSE_MODE=approve` to ACP `read-only`. Its ACP provider starts with no extra command-line arguments.
- Goose's actual downloaded Windows v1.56.0 binary `run --help` confirmed `--recipe`, `--provider`, `--model`, `--no-profile`, `--no-session` and `--output-format stream-json` are accepted. This help check did not call a model.
- [Codex ACP README](https://github.com/agentclientprotocol/codex-acp) documents `CODEX_PATH` and `CODEX_CONFIG`. Official `src/index.ts`, `src/CodexHookConfig.ts`, `src/CodexJsonRpcConnection.ts` and `src/CodexAcpClient.ts` show `CODEX_CONFIG` is a session override, while `CODEX_PATH` selects the actual app-server launcher. Consequently session overrides alone are insufficient to disable startup behavior; Kivou guards the launcher too.
- [Codex config source](https://github.com/openai/codex/blob/main/codex-rs/config/src/config_toml.rs) documents `project_root_markers`; the loader determines the project config search boundary from these markers. Kivou creates `.kivou-root` in each run directory and sets that marker before invoking metadata checks and app-server.

## Actual local CLI checks

Installed CLI: `codex-cli 0.164.0-alpha.11.1`.

1. An isolated temporary `CODEX_HOME` contained only synthetic MCP entries with a nonexistent executable. `codex -c mcp_servers={} mcp list --json` still listed the synthetic entry. This establishes that clearing an empty table is insufficient. The nonexistent command was never run.
2. `verifyGuard` was exercised against the same actual CLI using two **enabled synthetic** entries, one with a dotted name. It returned successfully only after both entries were reported `enabled=false`. No user auth/config files were read by Kivou, and no model/API call occurred.
3. The installed CLI's feature inventory lists every flag used by the guard. CLI configuration checks accepted the generated inline-table MCP overrides and `default_permissions=:read-only`.
4. `--strict-config` is rejected for the `mcp` and `features` subcommands in this version; Kivou does not pass it to those checks. It is accepted by `app-server`, where the guard applies it before any model session.
5. The installed `@agentclientprotocol/codex-acp 2.3.0` completed a real ACP protocol-1 `initialize` handshake through Kivou's generated `CODEX_PATH` wrapper. This used a fresh synthetic `CODEX_HOME` with an enabled nonexistent-command MCP entry, no authentication, and no model call. The adapter reported its name/version and the wrapper produced the expected fixed policy receipt. This proves that this installed adapter actually invokes the guarded app-server; it does not prove authenticated model access.
6. A Windows command shim with spaces reproduced a quoting failure with Node's default `windowsVerbatimArguments=false`; setting it to `true` fixed the probe. The actual Goose/Codex/ACP availability probe subsequently returned ready, and a regression test covers this command-shim case.
7. A single authorized real Research run with Goose `approve` and unchanged guarded Codex read-only permissions completed in 45,683 ms. It returned a W3C captions brief, one model-reported source, explicit uncertainties, and the expected MCP/plugins/shell-disabled runtime receipt. Evidence: [research-approve-live.json](../qa/research-approve-live.json). Source retrieval remains `not-independently-observed`; completion does not establish factual verification or legal compliance.

## What the guard enforces

The guard runs metadata-only MCP CLI checks, extracts only names/enabled bits and never logs or stores the remaining configuration fields. It disables each known MCP server with an exact-name inline TOML table, validates that all entries are disabled, and forwards only a strictly recognized `app-server` launch. Unexpected startup arguments fail closed, avoiding later arguments that could override policy. Startup flags suppress installed plugins/apps/hooks, shell execution and host skills. The existing CLI retains responsibility for authentication.

Content workflows force `web_search=disabled` and explicitly transform only supplied text. Research workflows use `web_search=live`, the provider's native search capability; this does not enable MCP, shell, view-image or browser automation. A denied/unavailable search must be disclosed with empty source evidence. The runtime receipt records the chosen web-search disposition, which the service checks against the workflow before marking completion.

### Goose Chat bridge limitation

Pinned `crates/goose/src/acp/provider.rs` sets `reject_all_tools = goose_mode == GooseMode::Chat`. At every `AcpUpdate::ToolCallStart`, Chat mode sets `suppress_text=true`; later assistant output is hidden and a plain `Tool call was denied.` message is emitted at tool completion. Thus native web search notifications can destroy an otherwise valid final research answer at the Goose display/stream bridge. Research uses Goose `approve` to retain these events and final text, while the upstream Codex provider still selects the same **read-only** mode. Guarded Codex startup permissions, `approval_policy=never`, and all blocked-tool flags remain unchanged. The native public search is the only extra enabled research tool.

A successful wrapper launch writes `runtime-policy.json`, a fixed set of booleans with a policy identifier. It contains no account data, MCP names or transports. The service checks it before declaring a real AI workflow complete. Cancellation retains the active-run lock until the model process actually exits, preventing overlap with a newly started workflow.

## Remaining limits

- The synthetic checks, actual unauthenticated ACP handshake and actual Research service run establish different parts of the runtime path. The primary implementation must still verify the rebuilt packaged app before release; service-level model success does not replace an application smoke test.
- A normal CLI account remains subject to usage limits and provider availability. The guard does not bypass managed enterprise policy or authenticate the user on its behalf.
- This is an application/tool boundary, not protection against a hostile process with the same OS user's ability to change executables or configuration while a run starts. The app does not claim to provide a new OS sandbox.
- Research URLs supplied by either the user or the model are never counted as independently retrieved. They retain explicit unverified provenance until a separately implemented, observable retrieval mechanism exists.

## Authenticated runtime follow-up

Actual Content Pack and Research calls completed through the normal ChatGPT login. A separate actual Kivou.exe Content Pack completed in 50.928 seconds through its bundled Goose/ACP resources; see qa/packaged-model.json. The earlier paragraph describing the unauthenticated handshake alone is not a claim that live access remained untested. Research mode changed to approve after confirming pinned Goose Chat suppressed text after native tool events; the Codex read-only guard remains applied in both modes.
