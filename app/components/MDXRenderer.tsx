import * as runtime from "react/jsx-runtime";
import { useMDXComponent } from "mdx-js-react";
import { evaluateSync } from "@mdx-js/mdx";
import { useMemo } from "react";

export default function MDXRenderer({ code }: { code: string }) {
  const Component = useMemo(() => {
    const { default: Comp } = evaluateSync(code, {
      ...runtime,
      useDynamicImport: false,
      outputFormat: "function-body",
      baseUrl: import.meta.url, // required in Vite/Remix
    });
    return Comp;
  }, [code]);

  return <Component />;
}

