import type { MetaFunction } from "@remix-run/node";
import Frame from '../components/Frame';

export const meta: MetaFunction = () => {
  return [
    { title: "doj47 - What are Trump's lawyers doing?" },
    { name: "description", content: "Following the activities of Trump's Department of Justice." },
  ];
};

export default function Index() {
  return <Frame>
        <section id="cases" className="py-12">
          <h2 className="text-2xl font-semibold mb-4">Cases</h2>
          <p className="text-gray-600">A list or overview of recent and historic DOJ cases related to administration 47.</p>
        </section>

        <section id="firms" className="py-12 border-t border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">Firms</h2>
          <p className="text-gray-600">Explore the law firms involved in ongoing or past cases.</p>
        </section>

        <section id="lawyers" className="py-12 border-t border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">Lawyers</h2>
          <p className="text-gray-600">Profiles of attorneys featured prominently in DOJ 47 proceedings.</p>
        </section>
    </Frame>;
}

