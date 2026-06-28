declare module "react-simple-maps" {
  import type { ReactNode, SVGProps } from "react";

  interface ComposableMapProps extends SVGProps<SVGSVGElement> {
    projection?: string;
    projectionConfig?: Record<string, number>;
    width?: number;
    height?: number;
  }

  interface GeographyProps extends SVGProps<SVGPathElement> {
    geography: object;
  }

  interface GeographiesProps {
    geography: string | object;
    children: (data: { geographies: object[] }) => ReactNode;
  }

  interface MapContextValue {
    projection: (coordinates: [number, number]) => [number, number] | null;
  }

  export function ComposableMap(props: ComposableMapProps): JSX.Element;
  export function Geographies(props: GeographiesProps): JSX.Element;
  export function Geography(props: GeographyProps): JSX.Element;
  export function useMapContext(): MapContextValue;
}
