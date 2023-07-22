export type Position = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};
export const findPosition = (
  eventTarget: Element,
  elementArea: DOMRect
): {
  targetElement_position: Position;
  eventTarget_position: Position;
} => {
  const eventTargetArea = eventTarget?.getClientRects()[0];
  const targetElement_position: Position = {
    top: elementArea?.top as number,
    bottom: elementArea?.bottom as number,
    left: elementArea?.left as number,
    right: elementArea?.right as number,
  };
  const eventTarget_position: Position = {
    top: eventTargetArea?.top as number,
    bottom: eventTargetArea?.bottom as number,
    left: eventTargetArea?.left as number,
    right: eventTargetArea?.right as number,
  };

  return {
    targetElement_position: targetElement_position,
    eventTarget_position: eventTarget_position,
  };
};

export const detectRange = (
  event: MouseEvent | React.MouseEvent,
  targetArea: DOMRect | undefined
): boolean => {
  const target = event.target as Element;
  const target_area = targetArea as DOMRect;
  const { targetElement_position, eventTarget_position } = findPosition(
    target,
    target_area
  );
  const inner_x: boolean =
    eventTarget_position.left >= targetElement_position.left &&
    eventTarget_position.right <= targetElement_position.right;
  const inner_y: boolean =
    eventTarget_position.top >= targetElement_position.top &&
    eventTarget_position.bottom <= targetElement_position.bottom;
  return inner_x && inner_y;
};
