import { Audio } from "@remotion/media";
import type { ReactNode } from "react";
import {
  AbsoluteFill,
  CanvasImage,
  Easing,
  Interactive,
  Sequence,
  Track,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type Props = { capturesReady: boolean };

const Mark = ({ size = 80 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    aria-label="Kivou geometric K mark"
  >
    <path
      d="M12 12H33V88H12Z M42 50L74 12H99L66 50L99 88H74Z"
      fill="currentColor"
    />
  </svg>
);

const Opening = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#f4f1e8", color: "#21231f" }}>
      <Interactive.Div
        name="Opening wordmark"
        style={{
          position: "absolute",
          top: 106,
          left: 120,
          display: "flex",
          alignItems: "center",
          gap: 28,
          fontSize: 62,
          letterSpacing: "-0.03em",
        }}
      >
        <Mark size={63} /> Kivou
      </Interactive.Div>
      <Interactive.Div
        name="Good ideas title"
        style={{
          position: "absolute",
          top: 330,
          left: 120,
          fontSize: 133,
          lineHeight: 1.04,
          letterSpacing: "-0.035em",
          translate: interpolate(
            frame,
            [0, 0.8 * fps],
            ["0px 35px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
          opacity: interpolate(frame, [0, 0.45 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Good ideas deserve
      </Interactive.Div>
      <Interactive.Div
        name="Clear next step highlight"
        style={{
          position: "absolute",
          top: 484,
          left: 112,
          padding: "0 14px 12px",
          fontSize: 133,
          lineHeight: 1.04,
          letterSpacing: "-0.035em",
          backgroundColor: "#d5f260",
          clipPath: `inset(0 ${interpolate(frame, [0.35 * fps, 1.1 * fps], [100, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) })}% 0 0)`,
        }}
      >
        a clear next step.
      </Interactive.Div>
      <Interactive.Div
        name="Opening context"
        style={{
          position: "absolute",
          left: 124,
          top: 820,
          fontSize: 42,
          color: "#55594f",
          opacity: interpolate(frame, [1.2 * fps, 1.7 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        An AI workspace for creators.
      </Interactive.Div>
    </AbsoluteFill>
  );
};

const WorkflowScene = ({
  capturesReady,
  file,
  title,
  detail,
  label,
  note,
  tint = false,
}: Props & {
  file: string;
  title: ReactNode;
  detail: ReactNode;
  label: string;
  note: string;
  tint?: boolean;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        backgroundColor: tint ? "#e8edda" : "#f4f1e8",
        color: "#21231f",
      }}
    >
      <Interactive.Div
        name="Workflow title"
        style={{
          position: "absolute",
          top: 270,
          left: 120,
          width: 510,
          fontSize: 92,
          letterSpacing: "-0.035em",
          lineHeight: 1.02,
          opacity: interpolate(frame, [0, 0.5 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {title}
      </Interactive.Div>
      <Interactive.Div
        name="Workflow supporting copy"
        style={{
          position: "absolute",
          top: 550,
          left: 124,
          width: 460,
          fontSize: 43,
          lineHeight: 1.25,
          color: "#55594f",
        }}
      >
        {detail}
      </Interactive.Div>
      <Interactive.Div
        name="Actual application capture"
        style={{
          position: "absolute",
          left: 710,
          top: 182,
          width: 1120,
          height: 716,
          overflow: "hidden",
          borderRadius: 18,
          backgroundColor: "#e6e4dc",
          boxShadow: "0px 24px 70px rgba(22, 24, 20, 0.16)",
          scale: interpolate(frame, [0, 4.5 * fps], [0.96, 1.015], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(
            frame,
            [0, 0.8 * fps],
            ["0px 55px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
        }}
      >
        {capturesReady ? (
          <CanvasImage
            src={staticFile(file)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              backgroundColor: "#f4f1e8",
            }}
          />
        ) : (
          <div
            style={{
              padding: 70,
              fontSize: 54,
              lineHeight: 1.2,
              color: "#21231f",
            }}
          >
            Actual application capture pending.
            <div style={{ fontSize: 28, marginTop: 35 }}>
              Scaffolding preview only. Final export is blocked until the real
              screenshot is supplied.
            </div>
          </div>
        )}
      </Interactive.Div>
      <Interactive.Div
        name="Workflow label"
        style={{
          position: "absolute",
          left: 124,
          bottom: 110,
          fontSize: 34,
          color: "#55594f",
        }}
      >
        {label}
      </Interactive.Div>
      <Interactive.Div
        name="Capture context"
        style={{
          position: "absolute",
          left: 710,
          bottom: 110,
          width: 1120,
          fontSize: 28,
          color: "#55594f",
        }}
      >
        {note}
      </Interactive.Div>
    </AbsoluteFill>
  );
};

const Closing = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#d5f260", color: "#21231f" }}>
      <Interactive.Div
        name="Closing mark"
        style={{
          position: "absolute",
          top: 164,
          left: 120,
          width: 170,
          height: 170,
          rotate: interpolate(frame, [0, 0.75 * fps], ["-12deg", "0deg"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          scale: interpolate(frame, [0, 0.75 * fps], [0.8, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            output: "perceptual-scale",
          }),
        }}
      >
        <Mark size={170} />
      </Interactive.Div>
      <Interactive.Div
        name="Closing Kivou wordmark"
        style={{
          position: "absolute",
          left: 352,
          top: 145,
          fontSize: 195,
          letterSpacing: "-0.04em",
          lineHeight: 1,
        }}
      >
        Kivou
      </Interactive.Div>
      <Interactive.Div
        name="Closing promise"
        style={{
          position: "absolute",
          left: 124,
          top: 438,
          fontSize: 86,
          lineHeight: 1.06,
          letterSpacing: "-0.035em",
          opacity: interpolate(frame, [0.4 * fps, 0.9 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Your next idea,
        <br />
        ready to make.
      </Interactive.Div>
      <Interactive.Div
        name="Open source and upstream credit"
        style={{
          position: "absolute",
          left: 128,
          top: 722,
          fontSize: 43,
          color: "#414d23",
        }}
      >
        Open source. Built on Goose.
      </Interactive.Div>
      <Interactive.Div
        name="Repository URL"
        style={{
          position: "absolute",
          left: 128,
          bottom: 108,
          fontSize: 46,
          letterSpacing: "-0.02em",
        }}
      >
        github.com/rayaneDR/kivou
      </Interactive.Div>
      <Interactive.Div
        name="Closing motion accent"
        style={{
          position: "absolute",
          right: 156,
          top: 362,
          width: 310,
          height: 310,
          borderRadius: 155,
          backgroundColor: "#21231f",
          translate: interpolate(
            frame,
            [0.15 * fps, 1.1 * fps],
            ["330px 0px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
        }}
      >
        <svg width="310" height="310" viewBox="0 0 310 310">
          <path
            d="M82 155H228M174 100L229 155L174 210"
            fill="none"
            stroke="#d5f260"
            strokeWidth="16"
          />
        </svg>
      </Interactive.Div>
    </AbsoluteFill>
  );
};

export const KivouAd = ({ capturesReady }: Props) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        fontFamily: "Albert Sans, sans-serif",
        fontWeight: 600,
        backgroundColor: "#f4f1e8",
      }}
    >
      <style>{`@font-face {font-family: 'Albert Sans'; src: url('${staticFile("albert-sans-600.woff2")}') format('woff2'); font-weight: 600; font-display: block;}`}</style>
      <Track name="Product story">
        <Sequence name="A clear next step" durationInFrames={3.5 * fps}>
          <Opening />
        </Sequence>
        <Sequence
          name="Research Brief"
          from={3.5 * fps}
          durationInFrames={4.5 * fps}
        >
          <WorkflowScene
            file="research.png"
            capturesReady={capturesReady}
            title={
              <>
                Research
                <br />
                with context.
              </>
            }
            detail="Keep sources and open questions together."
            label="Research Brief"
            note="Preview form · Connect your model to run"
          />
        </Sequence>
        <Sequence name="Content Pack" from={8 * fps} durationInFrames={5 * fps}>
          <WorkflowScene
            file="content.png"
            capturesReady={capturesReady}
            title={
              <>
                Make the
                <br />
                idea usable.
              </>
            }
            detail={
              <>
                Hooks. Script.
                <br />
                Shot list. Captions.
              </>
            }
            label="Content Pack"
            note="Preview form · Connect your model to run"
            tint
          />
        </Sequence>
        <Sequence
          name="Asset Manifest"
          from={13 * fps}
          durationInFrames={5 * fps}
        >
          <WorkflowScene
            file="assets.png"
            capturesReady={capturesReady}
            title={
              <>
                Bring order
                <br />
                to the files.
              </>
            }
            detail="A manifest, without moving your originals."
            label="Asset Manifest"
            note="Sample files · Actual local inventory"
          />
        </Sequence>
        <Sequence
          name="Kivou and repository"
          from={18 * fps}
          durationInFrames={6 * fps}
        >
          <Closing />
        </Sequence>
      </Track>
      <Track name="Original sound design">
        <Audio
          name="Kivou pulse and chimes"
          src={staticFile("kivou-original.wav")}
          durationInFrames={24 * fps}
          volume={0.7}
        />
      </Track>
    </AbsoluteFill>
  );
};
