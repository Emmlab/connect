import React from "react";
import Image, { StaticImageData } from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github } from "lucide-react";

import { GithubDeveloperRepositoriesType } from "@/utils/types/developer";
import { format } from "date-fns";
import typescript from "@/assets/programingLanguages/typescript.png";
import swift from "@/assets/programingLanguages/swift.png";
import scala from "@/assets/programingLanguages/scala.png";
import html from "@/assets/programingLanguages/html.png";
import rust from "@/assets/programingLanguages/rust.png";
import ruby from "@/assets/programingLanguages/ruby.png";
import python from "@/assets/programingLanguages/python.png";
import php from "@/assets/programingLanguages/php.png";
import javascript from "@/assets/programingLanguages/javascript.png";
import java from "@/assets/programingLanguages/java.png";
import go from "@/assets/programingLanguages/go.png";
import csharp from "@/assets/programingLanguages/c-sharp.png";
import cplusplus from "@/assets/programingLanguages/c-plusplus.png";
import c from "@/assets/programingLanguages/c.png";
import css from "@/assets/programingLanguages/css.png";

/**
 * The `GithubRepositoriesCard` component renders a clickable card displaying information about a
 * GitHub repository, including the repository name, creation date, and description.
 * @param  - The `GithubRepositoriesCard` component is a React functional component that renders a card
 * displaying information about a GitHub repository. It takes a `repositoryItem` object as a prop,
 * which should have the following shape based on the provided code snippet:
 * @returns The `GithubRepositoriesCard` component is being returned. It is a card component displaying
 * information about a GitHub repository. The card includes the repository name, creation date,
 * description, and a link to the repository on GitHub.
 */
const GithubRepositoriesCard = ({
  repositoryItem,
}: {
  repositoryItem: GithubDeveloperRepositoriesType;
}) => {
  type LanguagesIcons = {
    [key: string]: StaticImageData;
  };
  const languagesIcons: LanguagesIcons = {
    typescript: typescript,
    swift: swift,
    scala: scala,
    html: html,
    rust: rust,
    ruby: ruby,
    python: python,
    php: php,
    javascript: javascript,
    java: java,
    go: go,
    "c#": csharp,
    "c++": cplusplus,
    c: c,
    css: css
  };
  const language = repositoryItem?.language?.toLowerCase() || null;
  return (
    <Card
      className="bg-muted border border-slate-500 rounded-md cursor-pointer"
      onMouseDown={() => window.open(repositoryItem.html_url)}
    >
      <CardHeader className="flex gap-2 p-2 md:px-5 w-full">
        <CardTitle className="flex items-center gap-2 relative w-full">
          <div className="rounded-full border-2 border-slate-400 bg-slate-400 text-white w-[30px] h-[30px] md:w-[40px] md:h-[40px] flex items-center justify-center">
            <Github />
          </div>
          <div className="flex flex-col flex-grow relative">
            <div className="flex items-center justify-between w-full">
              <div className="line-clamp-1 text-base ">
                {repositoryItem.name || "Unknown"}
              </div>
              {language ? (
                <div className="flex items-center">
                  {/* Language: */}
                  {Object.keys(languagesIcons).includes(language) ? (
                    <Image
                      src={languagesIcons[language]}
                      alt="Failure Illustration"
                      className="h-[15px] w-[25px] rounded-md object-contain"
                    />
                  ) : (
                    <span className="text-xs px-2 border border-slate-500 rounded-lg">
                      {repositoryItem.language}
                    </span>
                  )}
                </div>
              ) : null}
            </div>
            <div className="text-xs font-normal italic flex items-center gap-1">
              Created on {format(repositoryItem.created_at, "LLL dd, y")}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 md:px-5 md:pt-0 md:pb-4">
        <div className="md:pl-[48px]">{repositoryItem.description}</div>
      </CardContent>
    </Card>
  );
};

export default GithubRepositoriesCard;
