import { Composition } from "remotion";
import { KivouAd } from "./Kivou";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Kivou"
        component={KivouAd}
        durationInFrames={720}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ capturesReady: true }}
      />
    </>
  );
};
