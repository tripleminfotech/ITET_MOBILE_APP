import React,{ useEffect, useState } from 'react';
import ContentLoader, { Rect, Circle, Path } from "react-content-loader/native";
export const loaderData = [1,2,3,4,5,6,7,8,9,10]
export const MyLoader = () => (
  <ContentLoader 
    height={100}
    width={400}
    speed={2}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
    
  >
    <Rect x="110" y="10.92" rx="4" ry="4" width="288.99" height="12.24" /> 
    <Rect x="110" y="29.92" rx="3" ry="3" width="255.85" height="9.85" /> 
    <Rect x="20.33" y="5.92" rx="0" ry="0" width="78.48" height="71.72" /> 
    <Rect x="110" y="35.92" rx="0" ry="0" width="0" height="0" /> 
    <Rect x="110" y="54.78" rx="3" ry="3" width="55.93" height="10.05" /> 
    <Rect x="181" y="54.78" rx="3" ry="3" width="55.93" height="10.05" /> 
    <Rect x="248" y="54.78" rx="3" ry="3" width="55.93" height="10.05" />
</ContentLoader>
)
export const MyLoader1 = () => (
  <ContentLoader 
height={245}
width={400}
speed={2}
primaryColor="#f3f3f3"
secondaryColor="#ecebeb"

>
<Rect x="5.33" y="2.92" rx="0" ry="0" width="392.0416" height="175.5648" /> 
<Rect x="5.33" y="189.25" rx="0" ry="0" width="369.53" height="12.24" /> 
<Rect x="5.33" y="208" rx="0" ry="0" width="336.37" height="10.05" /> 
<Rect x="5.33" y="227.46" rx="0" ry="0" width="150.08" height="10.05" /> 
<Rect x="165.33" y="229.25" rx="0" ry="0" width="150.08" height="10.05" />
</ContentLoader>
)