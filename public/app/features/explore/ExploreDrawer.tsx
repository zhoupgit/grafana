// Libraries
import { css, cx, keyframes } from '@emotion/css';
import { Resizable, ResizeCallback } from 're-resizable';
import React from 'react';

// Services & Utils
import { GrafanaTheme2 } from '@grafana/data';
import { getDragStyles, useTheme2 } from '@grafana/ui';

export interface Props {
  full?: boolean;
  children: React.ReactNode;
  onResize?: ResizeCallback;
}

export function ExploreDrawer(props: Props) {
  const { full, children, onResize } = props;
  const theme = useTheme2();
  const styles = getStyles(theme, !!full); // if width is defined, it is not full-width
  const dragStyles = getDragStyles(theme);

  return (
    <Resizable
      className={cx(styles.fixed, styles.container, styles.drawerActive)}
      defaultSize={{ width: '100%', height: `${theme.components.horizontalDrawer.defaultHeight}px` }}
      handleClasses={{ top: dragStyles.dragHandleHorizontal }}
      enable={{
        top: true,
        right: false,
        bottom: false,
        left: false,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }}
      maxHeight="100vh"
      onResize={onResize}
    >
      {children}
    </Resizable>
  );
}

const drawerSlide = (theme: GrafanaTheme2) => keyframes`
  0% {
    transform: translateY(${theme.components.horizontalDrawer.defaultHeight}px);
  }

  100% {
    transform: translateY(0px);
  }
`;

const getStyles = (theme: GrafanaTheme2, full: boolean) => ({
  // @ts-expect-error csstype doesn't allow !important. see https://github.com/frenic/csstype/issues/114
  fixed: css({
    position: `${full ? 'fixed' : 'absolute'} !important`,
  }),
  container: css({
    bottom: 0,
    left: full ? 0 : undefined,
    background: theme.colors.background.primary,
    borderTop: `1px solid ${theme.colors.border.weak}`,
    boxShadow: theme.shadows.z3,
    zIndex: theme.zIndex.navbarFixed,
  }),
  drawerActive: css({
    opacity: 1,
    animation: `0.5s ease-out ${drawerSlide(theme)}`,
  }),
});
