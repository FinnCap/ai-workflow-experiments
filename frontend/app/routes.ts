import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
    route("/", "./layouts/app-layout.tsx", [
        route("api", "./pages/Api/index.tsx"),
        route("api/new", "./pages/Api/Edit/index.tsx", { id: "api-new" }),
        route("api/:id/edit", "./pages/Api/Edit/index.tsx", { id: "api-edit" }),

        route("agent", "./pages/Agent/index.tsx"),
        route("agent/new", "./pages/Agent/Edit/index.tsx", { id: "agent-new" }),
        route("agent/:id/edit", "./pages/Agent/Edit/index.tsx", { id: "agent-edit" }),

        route("flow", "./pages/Flow/index.tsx"),
        route("flow/new", "./pages/Flow/Edit/index.tsx", { id: "flow-new" }),
        route("flow/:id/edit", "./pages/Flow/Edit/index.tsx", { id: "flow-edit" }),
        route("flow/:id/test", "./pages/Flow/Test/index.tsx", { id: "flow-test" }),

        route("chat", "./pages/Chat/index.tsx"),

        route("log", "./pages/Log/index.tsx"),
        route("log/flow/:flowExecutionId", "./pages/Log/Flow/index.tsx"),
    ]),
] satisfies RouteConfig;
