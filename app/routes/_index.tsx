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
    <section>
      <p>The Trump administration quickly made clear that if you work for the DOJ, you are not one of America's lawyers, but one of Trump's lawyers:</p>
      <blockquote>
        <div>
          When Department of Justice attorneys, for example, refuse to advance good-faith arguments by declining to appear in court or sign briefs, it undermines the constitutional order and deprives the President of the benefit of his lawyers.
        </div>
        <cite>Attorney General Pam Bondi, 2025-02-05, <a href="https://www.justice.gov/ag/media/1388521/dl?inline">General Policy Regarding Zealous Advocacy on Behalf of the United States</a></cite>
      </blockquote>
      <p>As it turns out, if you work for some Big Law firms, you might be one of his lawyers, too!</p>
      <p>This website tracks the Trump administration's use of the courts during his second presidency.</p>
    </section>
    <section>
      <h2>Cases</h2>
      <p>A list or overview of recent and historic DOJ cases related to administration 47.</p>
    </section>

    <section>
      <h2>Firms</h2>
      <p>Explore the law firms involved in ongoing or past cases.</p>
    </section>

    <section>
      <h2>Lawyers</h2>
      <p>Profiles of attorneys featured prominently in DOJ 47 proceedings.</p>
    </section>
  </Frame>;
}

