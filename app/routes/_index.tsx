import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { getRecentChunks } from '~/utils/db.server';
import Frame from '~/components/Frame';
import Chunk from '~/components/Chunk';

export const meta: MetaFunction = () => {
  return [
    { title: "doj47 - What are Trump's lawyers doing?" },
    { name: "description", content: "Following the activities of Trump's Department of Justice." },
  ];
};

export const loader: LoaderFunction = async () => {
  const recentChunks = getRecentChunks();

  return json({ recentChunks });
};

export default function Index() {
  const { recentChunks } = useLoaderData<typeof loader>();
  console.log(recentChunks);

  return <Frame>
    <section>
      <p>If you work for the Department of Justice, you are not one of <i>America's</i> lawyers, but one of <i>Trump's</i> lawyers.</p>
      <div class="max-w-6xl mx-auto grid gap-8 md:grid-cols-2 mt-2 mb-4">

        <blockquote class="flex flex-col justify-between bg-white shadow-md rounded-xl p-6 min-h-full border-l-4 border-gray-300">
          <p class="text-lg leading-relaxed mb-4">
            “When Department of Justice attorneys, for example, refuse to advance good-faith arguments by declining to appear in court or sign briefs, it undermines the constitutional order and deprives the President of the benefit of his lawyers.”
          </p>
          <footer class="text-sm text-gray-600 space-y-1">
            <div><strong>Attorney General Pam Bondi</strong>,           <time datetime="2025-02-05">2025-02-05</time></div>
            <div>

              <a href="https://www.justice.gov/ag/media/1388521/dl?inline" class="underline hover:text-gray-800">General Policy Regarding Zealous Advocacy on Behalf of the United States</a>
            </div>
          </footer>
        </blockquote>

        <blockquote class="flex flex-col justify-between bg-white shadow-md rounded-xl p-6 min-h-full border-l-4 border-gray-300">
          <p class="text-lg leading-relaxed mb-4">
            “As President Trumps&#x27; [sic] lawyers, we are proud to fight to protect his leadership as our President and we are vigilant in standing against entities like the [Associated Press] that refuse to put America first.”
          </p>
          <footer class="text-sm text-gray-600 space-y-1">
            <div><strong>US Attorney for District of Columbia Ed Martin</strong>, <time datetime="2025-02-24">2025-02-24</time></div>
            <div>
              <a href="https://x.com/USAO_DC/status/1894119675786621225" class="underline hover:text-gray-800">tweet</a>
            </div>
          </footer>
        </blockquote>

      </div>
      <p>It turns out, if you work for some Big Law firms, you might be one of his lawyers, too!</p>
      <p>This website tracks the Trump administration's use of the courts during his second presidency. You can follow updates on <a href="/cases">cases</a>, <a href="/firms">law firms</a>, or <a href="/lawyers">lawyers</a>.</p>
      <h1>Recent updates</h1>
      {recentChunks.map(chunk => <Chunk key={chunk.id} chunk={chunk} foreign={true}/> )}
    </section>
  </Frame>;
}

