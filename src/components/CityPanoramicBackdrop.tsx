import React from 'react';
import { CitySkylineBackdrop, CitySkylineBackdropProps } from './CitySkylineBackdrop';

export type CityPanoramicBackdropProps = CitySkylineBackdropProps;

export const CityPanoramicBackdrop: React.FC<CityPanoramicBackdropProps> = (props) => {
  return <CitySkylineBackdrop {...props} />;
};

export default CityPanoramicBackdrop;
