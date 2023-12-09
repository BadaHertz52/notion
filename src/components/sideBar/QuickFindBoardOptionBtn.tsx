import React, { useCallback, Dispatch, SetStateAction } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { QuickFindBoardOption, ResultType } from "../../types";
import { OPTION } from "../../constants";
type QuickFindBoardOptionBtnProp = {
  option: QuickFindBoardOption;
  selectedOption: QuickFindBoardOption;
  setSelectedOption: Dispatch<SetStateAction<QuickFindBoardOption>>;
  search: boolean;
  result: ResultType[] | undefined;
  bestMatchesResult: ResultType[] | undefined;
  setResult: Dispatch<SetStateAction<ResultType[] | undefined>>;
  openSortOptions: () => void;
};

function QuickFindBoardOptionBtn({
  option,
  selectedOption,
  setSelectedOption,
  result,
  setResult,
  bestMatchesResult,
  search,
  openSortOptions,
}: QuickFindBoardOptionBtnProp) {
  const compareResult = useCallback(
    (
      a: ResultType,
      b: ResultType,
      what: "editTime" | "createTime",
      sort: "newest" | "oldest"
    ) => {
      const A =
        what === "createTime" ? Number(a.createTime) : Number(a.editTime);
      const B =
        what === "createTime" ? Number(b.createTime) : Number(b.editTime);
      let value: number = 0;
      switch (sort) {
        case "newest":
          value = B - A;
          break;
        case "oldest":
          value = A - B;
          break;
        default:
          break;
      }
      return value;
    },
    []
  );

  const onClickOption = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      const selected = document
        .getElementById("quickFindBoard")
        ?.getElementsByClassName("selected")[0];
      if (selected) {
        selected?.classList.remove("selected");
      }
      const target = event.target as HTMLElement;
      // switch (target.tagName.toLowerCase()) {
      //   case "button":
      //     option = target.firstChild?.textContent as string;
      //     target.classList.add("selected");
      //     break;
      //   case "div":
      //     target.parentElement?.classList.add("selected");
      //     if (target.className === "optionName") {
      //       option = target.textContent as string;
      //     } else {
      //       option = target.previousElementSibling?.textContent as string;
      //     }
      //     break;
      //   case "svg":
      //     option = target.parentElement?.previousElementSibling
      //       ?.textContent as string;
      //     target.parentElement?.parentElement?.classList.add("selected");
      //     break;
      //   case "path":
      //     option = target.parentElement?.parentElement?.previousElementSibling
      //       ?.textContent as string;
      //     target.parentElement?.parentElement?.parentElement?.classList.add(
      //       "selected"
      //     );
      //     break;
      //   default:
      //     break;
      // }

      setSelectedOption(option);
      if (result) {
        if (bestMatchesResult) {
          let sortedResult: ResultType[] | undefined = undefined;
          switch (option) {
            case "bestMatches":
              setResult(bestMatchesResult);
              break;
            case "lastEditedNewest":
              sortedResult = bestMatchesResult.sort((a, b) =>
                compareResult(a, b, "editTime", "newest")
              );
              break;
            case "lastEditedOldest":
              sortedResult = bestMatchesResult.sort((a, b) =>
                compareResult(a, b, "editTime", "oldest")
              );
              break;
            case "createdNewest":
              sortedResult = bestMatchesResult.sort((a, b) =>
                compareResult(a, b, "createTime", "newest")
              );
              break;
            case "createdOldest":
              sortedResult = bestMatchesResult.sort((a, b) =>
                compareResult(a, b, "createTime", "oldest")
              );
              break;
            default:
              break;
          }
          setResult(sortedResult);
        } else {
          setResult(bestMatchesResult);
        }
      }
      openSortOptions();
    },
    [bestMatchesResult, openSortOptions, result]
  );

  return (
    <button
      title={`button to select ${OPTION[option]}`}
      name={option}
      onClick={onClickOption}
      className={`${selectedOption === option ? "selected" : ""} optionBtn`}
    >
      <div className="optionName">{OPTION[option]}</div>
      <div className="checkIcon">
        <AiOutlineCheck />
      </div>
    </button>
  );
}

export default React.memo(QuickFindBoardOptionBtn);
