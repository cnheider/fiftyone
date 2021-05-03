import React, { Suspense, useLayoutEffect } from "react";
import {
  RecoilState,
  RecoilValueReadOnly,
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
} from "recoil";
import styled from "styled-components";

import Checkbox from "../Common/Checkbox";
import Input from "../Common/Input";
import * as selectors from "../../recoil/selectors";
import { filterView } from "../../utils/view";

const StringFilterContainer = styled.div`
  background: ${({ theme }) => theme.backgroundDark};
  border: 1px solid #191c1f;
  border-radius: 2px;
  color: ${({ theme }) => theme.fontDark};
  margin-top: 0.25rem;
  padding: 0.25rem 0.5rem 0 0.5rem;
`;

const NamedStringFilterContainer = styled.div`
  padding-bottom: 0.5rem;
  margin: 3px;
  font-weight: bold;
`;

const NamedStringFilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Footer = styled.div`
  margin: 0 -0.5rem;
  padding: 0.25rem 0.5rem;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  text-decoration: none;
  color: ${({ theme }) => theme.font};

  & > span {
    display: flex;
    justify-content: space-between;
  }
`;

const format = (num) => {
  return num.toLocaleString("en", { useGrouping: true });
};

const SelectionString = ({ selected, excluded }) => {
  return (
    <span>
      {format(selected.size)} {selected.size === 1 ? "selection" : "selections"}
    </span>
  );
};

interface WrapperProps {
  valuesAtom: RecoilValueReadOnly<{
    total: number;
    count: number;
    results: string[];
  }>;
  selectedValuesAtom: RecoilState<string[]>;
  searchAtom: RecoilState<string>;
  name: string;
  color: string;
}

const Wrapper = ({
  color,
  valuesAtom,
  selectedValuesAtom,
  searchAtom,
}: WrapperProps) => {
  const [selected, setSelected] = useRecoilState(selectedValuesAtom);
  const { count, total, results } = useRecoilValue(valuesAtom);
  const view = useRecoilValue(selectors.view);
  const search = useRecoilValue(searchAtom);
  const resetSearch = useResetRecoilState(searchAtom);
  const datasetName = useRecoilValue(selectors.datasetName);
  const selectedSet = new Set(selected);

  const allValues = [...new Set([...results, ...selected])]
    .sort()
    .filter((v) => v.includes(search));

  useLayoutEffect(() => {
    resetSearch();
  }, [filterView(view), datasetName]);

  return (
    <>
      {allValues.map((value) => (
        <Checkbox
          key={value}
          color={color}
          value={selectedSet.has(value)}
          name={value}
          setValue={(checked: boolean) => {
            if (checked) {
              selectedSet.add(value);
            } else {
              selectedSet.delete(value);
            }
            setSelected([...selectedSet].sort());
          }}
        />
      ))}
      <Footer>
        <SelectionString selected={selectedSet} excluded={false} />
        <span>
          {count !== total ? `${format(count)} of ` : null}
          {format(total)}
        </span>
      </Footer>
    </>
  );
};

interface Props {
  valuesAtom: RecoilValueReadOnly<{
    total: number;
    count: number;
    results: string[];
  }>;
  selectedValuesAtom: RecoilState<string[]>;
  searchAtom: RecoilState<string>;
  excludeAtom: RecoilState<boolean>;
  name: string;
  valueName: string;
  color: string;
}

const StringFilter = React.memo(
  React.forwardRef(
    (
      {
        name,
        searchAtom,
        valueName,
        valuesAtom,
        color,
        selectedValuesAtom,
      }: Props,
      ref
    ) => {
      const [search, setSearch] = useRecoilState(searchAtom);
      const [selected, setSelected] = useRecoilState(selectedValuesAtom);

      return (
        <NamedStringFilterContainer ref={ref}>
          <NamedStringFilterHeader>
            {name}
            <div>
              {selected.length > 0 ? (
                <a
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                  onClick={() => {
                    setSelected([]);
                    setSearch("");
                  }}
                >
                  reset
                </a>
              ) : null}
            </div>
          </NamedStringFilterHeader>
          <StringFilterContainer>
            <Input
              color={color}
              setter={(value) => setSearch(value)}
              value={search}
              onEnter={() => {
                const newSelected = new Set([...selected]);
                newSelected.add(search);
                setSelected([...newSelected].sort());
                setSearch("");
              }}
              placeholder={`+ filter by ${valueName}`}
            />
            <Suspense fallback={"..."}>
              <Wrapper
                searchAtom={searchAtom}
                color={color}
                name={name}
                valuesAtom={valuesAtom}
                selectedValuesAtom={selectedValuesAtom}
              />
            </Suspense>
          </StringFilterContainer>
        </NamedStringFilterContainer>
      );
    }
  )
);

export default StringFilter;
