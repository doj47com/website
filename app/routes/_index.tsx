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
    <section id="intro" className="pb-12">
      <blockquote>
When Department of Justice attorneys, for example, refuse to advance good-faith arguments by declining to appear in court or sign briefs, it undermines the constitutional order and deprives the President ofthe benefit of his lawyers.
      </blockquote>
      - 2025-02-05, Attorney General Pam Bondi, <a href="https://www.justice.gov/ag/media/1388521/dl?inline">General Policy Regarding Zealous Advocacy on Behalf of the United States</a>
      <p>The Trump administration has made it clear: if you work for the DOJ, you are one of Trump's lawyers.</p>
      <p>As it turns out, if you work for some Big Law firms, you're one of his lawyers, too.</p>
      <p>This website tracks the Trump administration's use of the courts during his second presidency.</p>
    </section>
    <section id="cases" className="pb-12">
      <h2 className="text-2xl font-semibold mb-4">Cases</h2>
      <p className="text-gray-600">A list or overview of recent and historic DOJ cases related to administration 47.</p>
    </section>

    <section id="firms" className="pb-12 border-t border-gray-200">
      <h2 className="text-2xl font-semibold mb-4">Firms</h2>
      <p className="text-gray-600">Explore the law firms involved in ongoing or past cases.</p>
    </section>

    <section id="lawyers" className="pb-12 border-t border-gray-200">
      <h2 className="text-2xl font-semibold mb-4">Lawyers</h2>
      <p className="text-gray-600">Profiles of attorneys featured prominently in DOJ 47 proceedings.</p>
    </section>
  </Frame>;
}

