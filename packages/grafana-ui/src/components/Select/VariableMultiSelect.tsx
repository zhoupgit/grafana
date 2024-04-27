import React, { RefCallback } from 'react';
import { MenuListProps } from 'react-select';

import { SelectableValue } from '@grafana/data';

import { useTheme2 } from '../../themes/ThemeContext';
import CustomScrollbar from '../CustomScrollbar/CustomScrollbar';

import { SelectBase } from './SelectBase';
import { getSelectStyles } from './getSelectStyles';
import { ActionMeta, MultiSelectCommonProps, SelectCommonProps } from './types';

export interface VariableMultiSelectCommonProps<T>
  extends Omit<SelectCommonProps<T>, 'onChange' | 'isMulti' | 'value'> {
  value?: Array<SelectableValue<T>> | T[];
  onChange: (item: Array<SelectableValue<T>>, actionMeta: ActionMeta) => {} | void;
}

export function VariableMultiSelect<T, Rest = {}>(props: MultiSelectCommonProps<T> & Rest) {
  // @ts-ignore
  return <SelectBase {...props} isMulti closeMenuOnSelect={false} hideSelectedOptions={false} />;
}

interface SelectMenuProps {
  maxHeight: number;
  innerRef: RefCallback<HTMLDivElement>;
  innerProps: {};
}

export const SelectMenu = ({ children, maxHeight, innerRef, innerProps }: React.PropsWithChildren<SelectMenuProps>) => {
  const theme = useTheme2();
  const styles = getSelectStyles(theme);

  return (
    <div {...innerProps} className={styles.menu} style={{ maxHeight }} aria-label="Select options menu">
      <CustomScrollbar scrollRefCallback={innerRef} autoHide={false} autoHeightMax="inherit" hideHorizontalTrack>
        {children}
      </CustomScrollbar>
    </div>
  );
};
