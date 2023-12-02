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
