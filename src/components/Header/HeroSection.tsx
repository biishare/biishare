"use client";

import {
  Box,
  Typography,
  Button,
  IconButton,
  Fade,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";

import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import Image from "next/image";
import Video from "next-video";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useQuery } from "@tanstack/react-query";

import { getAds } from "../../../services/ad.service";
import { Ad } from "../../../types/ad";
import { resolveAdConfig } from "../../../utils/add-engine";

/* ======================================================
 * TRACKING
 * ====================================================== */

function trackAdEvent(
  event: string,
  adId: string
) {
  console.log(`[AD EVENT] ${event}`, adId);
}

export default function AdHeroEngine() {
  /* ======================================================
   * STATE
   * ====================================================== */

  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] =
    useState(false);

  const isMobile = useMediaQuery(
    "(max-width:768px)"
  );

  /* ======================================================
   * QUERY
   * ====================================================== */

  const { data, isLoading } = useQuery({
    queryKey: ["ads", "hero"],
    queryFn: () =>
      getAds({
        layout: "hero",
        active: true,
        limit: 10,
      }),

    staleTime: 1000 * 60 * 5,

    placeholderData: (prev) => prev,
  });

  /* ======================================================
   * ADS
   * ====================================================== */

  const ads: Ad[] = useMemo(
    () => data?.data ?? [],
    [data]
  );

  const ad = ads[index];

  const config = useMemo(() => {
    if (!ad) return null;

    const baseConfig = resolveAdConfig(
      ad,
      isMobile
    );

    return {
      ...baseConfig,
    };
  }, [ad, isMobile]);

  /* ======================================================
   * RESET INDEX
   * ====================================================== */

  useEffect(() => {
    setIndex(0);
  }, [ads.length]);

  /* ======================================================
   * IMPRESSION
   * ====================================================== */

  useEffect(() => {
    if (!ad?._id) return;

    trackAdEvent("impression", ad._id);
  }, [ad?._id]);

  /* ======================================================
   * AUTO SLIDE
   * ====================================================== */

  const autoSlideDelay = useMemo(() => {
    if (!ad) return 6000;

    if (ad.mediaType === "video") {
      return 10000;
    }

    return isMobile ? 8000 : 6500;
  }, [ad, isMobile]);

  useEffect(() => {
    if (!ads.length) return;

    if (isHovered && !isMobile) return;

    const interval = setInterval(() => {
      setIndex(
        (prev) => (prev + 1) % ads.length
      );
    }, autoSlideDelay);

    return () => clearInterval(interval);
  }, [
    ads.length,
    isHovered,
    isMobile,
    autoSlideDelay,
  ]);

  /* ======================================================
   * LOADING
   * ====================================================== */

  if (isLoading) {
    return (
      <Box
        sx={{
          width: "100%",

          height: {
            xs: 500,
            sm: 520,
            md: 400,
            lg: 440,
          },

          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!ad || !config) return null;

  const mediaUrl =
    ad.mediaType === "image"
      ? ad.image
      : ad.video;

  /* ======================================================
   * CONTENT CHECK
   * ====================================================== */

  const hasTitle = !!ad.title;
  const hasSubtitle = !!ad.subtitle;
  const hasCTA = !!ad.cta;

  const hasContent =
    hasTitle ||
    hasSubtitle ||
    hasCTA;

  /* ======================================================
   * ACTIONS
   * ====================================================== */

  const handleClickCTA = () => {
    trackAdEvent("click_cta", ad._id);

    if (ad.link) {
      window.open(ad.link, "_blank");
    }
  };

  const goNext = () => {
    setIndex(
      (prev) => (prev + 1) % ads.length
    );
  };

  const goPrev = () => {
    setIndex(
      (prev) =>
        (prev - 1 + ads.length) %
        ads.length
    );
  };

  /* ======================================================
   * RENDER
   * ====================================================== */

  return (
    <Box
      onMouseEnter={() =>
        setIsHovered(true)
      }
      onMouseLeave={() =>
        setIsHovered(false)
      }
      sx={{
        position: "relative",

        width: "100%",

        height: {
          xs: 500,
          sm: 520,
          md: 400,
          lg: 440,
        },

        overflow: "hidden",

        borderRadius: {
          xs: 0,
          md: 6,
        },

        mx: {
          xs: 0,
          md: 2,
        },

        mt: 1.5,

        background: "#020617",

        boxShadow:
          "0 20px 60px rgba(0,0,0,.22)",
      }}
    >
      {/* ======================================================
       * BACKGROUND
       * ====================================================== */}

      {ad.mediaType === "image" ? (
        <Image
          src={mediaUrl}
          alt={ad.title || "banner"}
          fill
          priority
          style={{
            objectFit: "cover",

            transform: "scale(1.03)",

            filter: `blur(${Math.max(
              8,
              config.blur - 4
            )}px) brightness(.65)`,
          }}
        />
      ) : (
        <Video
          src={mediaUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          style={{
            position: "absolute",
            inset: 0,

            width: "100%",
            height: "100%",

            objectFit: "cover",

            transform: "scale(1.03)",

            filter: `blur(${Math.max(
              8,
              config.blur - 4
            )}px) brightness(.65)`,
          }}
        />
      )}

      {/* ======================================================
       * OVERLAY
       * ====================================================== */}

      <Box
        sx={{
          position: "absolute",
          inset: 0,

          background: {
            xs: `
              linear-gradient(
                to bottom,
                rgba(2,6,23,.72),
                rgba(2,6,23,.18) 34%,
                rgba(2,6,23,.92) 74%,
                rgba(2,6,23,.98)
              )
            `,
            md: `
              linear-gradient(
                to top,
                rgba(2,6,23,.92),
                rgba(2,6,23,.25),
                rgba(2,6,23,.7)
              )
            `,
          },
        }}
      />

      {/* ======================================================
       * LIGHT EFFECT
       * ====================================================== */}

      <Box
        sx={{
          position: "absolute",
          inset: 0,

          background: `
            radial-gradient(
              circle at top right,
              rgba(59,130,246,.14),
              transparent 30%
            )
          `,
        }}
      />

      {/* ======================================================
       * BADGE
       * ====================================================== */}

      <Box
        sx={{
          position: "absolute",

          top: 16,
          left: 16,

          zIndex: 20,

          display: "flex",
          alignItems: "center",
          gap: 0.7,

          px: 1.6,
          py: 0.8,

          borderRadius: 999,

          background:
            "rgba(15,23,42,.55)",

          backdropFilter: "blur(14px)",

          border:
            "1px solid rgba(255,255,255,.08)",

          color: "white",

          fontSize: 12,
          fontWeight: 700,
        }}
      >
        <Sparkles size={14} />
        Patrocinado
      </Box>

      {/* ======================================================
       * MOBILE AD LAYOUT
       * ====================================================== */}

      <Box
        sx={{
          position: "absolute",
          inset: 0,

          zIndex: 14,

          display: {
            xs: "flex",
            md: "none",
          },

          flexDirection: "column",

          px: 2,
          pt: 7.2,
          pb: 2,
        }}
      >
        <Fade
          key={`${ad._id}-mobile`}
          in
          timeout={450}
        >
          <Box
            sx={{
              position: "relative",

              flex: "1 1 auto",
              minHeight: 0,

              width: "100%",

              overflow: "hidden",

              borderRadius: 3,

              background:
                "rgba(2,6,23,.62)",

              border:
                "1px solid rgba(255,255,255,.12)",

              boxShadow:
                "0 14px 38px rgba(0,0,0,.42)",
            }}
          >
            {ad.mediaType === "image" ? (
              <Image
                src={mediaUrl}
                alt={ad.title || "ad"}
                fill
                sizes="100vw"
                style={{
                  objectFit: "contain",
                  objectPosition:
                    ad.focalPoint ??
                    "center",
                }}
              />
            ) : (
              <Video
                src={mediaUrl}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                style={{
                  width: "100%",
                  height: "100%",

                  objectFit: "contain",
                  objectPosition:
                    ad.focalPoint ??
                    "center",
                }}
              />
            )}
          </Box>
        </Fade>

        {hasContent && (
          <Box
            sx={{
              flex: "0 0 auto",

              mt: 1.4,
              p: 1.6,

              borderRadius: 3,

              background:
                "rgba(15,23,42,.72)",

              backdropFilter: "blur(16px)",

              border:
                "1px solid rgba(255,255,255,.1)",
            }}
          >
            {hasTitle && (
              <Typography
                sx={{
                  fontWeight: 900,

                  lineHeight: 1.08,

                  fontSize: 20,

                  color: "white",

                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {ad.title}
              </Typography>
            )}

            {hasSubtitle && (
              <Typography
                sx={{
                  mt: hasTitle ? 0.8 : 0,

                  color:
                    "rgba(255,255,255,.78)",

                  lineHeight: 1.45,

                  fontSize: 12.5,

                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {ad.subtitle}
              </Typography>
            )}

            {hasCTA && (
              <Button
                onClick={handleClickCTA}
                sx={{
                  mt:
                    hasTitle ||
                    hasSubtitle
                      ? 1.2
                      : 0,

                  px: 2,
                  py: 0.85,

                  borderRadius: 999,

                  textTransform: "none",

                  fontWeight: 800,

                  color: "white",

                  background:
                    "linear-gradient(135deg,#f59e0b,#fb923c)",

                  boxShadow:
                    "0 10px 25px rgba(245,158,11,.35)",
                }}
              >
                {ad.cta}
              </Button>
            )}
          </Box>
        )}
      </Box>

      {/* ======================================================
       * FOREGROUND
       * ====================================================== */}

      {config.showForeground && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,

            display: {
              xs: "none",
              md: "flex",
            },
            alignItems: {
              xs: "flex-start",
              md: "center",
            },
            justifyContent: "center",

            px: {
              xs: 2,
              md: 3,
            },

            pt: {
              xs: 58,
              sm: 64,
              md: 0,
            },

            pb: {
              xs: 132,
              sm: 146,
              md: 0,
            },
          }}
        >
          <Fade
            key={ad._id}
            in
            timeout={450}
          >
            <Box
              sx={{
                position: "relative",

                width: "100%",
                maxWidth: {
                  xs: 360,
                  sm: 440,
                  md: 720,
                },

                height: {
                  xs: "100%",
                  md: "76%",
                },

                overflow: "hidden",

                borderRadius: {
                  xs: 3,
                  md: 5,
                },

                transform: {
                  xs: "none",
                  md: "scale(.96)",
                },

                background: "rgba(2,6,23,.5)",

                boxShadow:
                  {
                    xs: "0 14px 36px rgba(0,0,0,.38)",
                    md: "0 20px 70px rgba(0,0,0,.45)",
                  },

                border:
                  "1px solid rgba(255,255,255,.08)",
              }}
            >
              {ad.mediaType === "image" ? (
                <Image
                  src={mediaUrl}
                  alt={ad.title || "ad"}
                  fill
                  style={{
                    objectFit:
                      config.fitMode as any,

                    objectPosition:
                      ad.focalPoint ??
                      "center",
                  }}
                />
              ) : (
                <Video
                  src={mediaUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  style={{
                    width: "100%",
                    height: "100%",

                    objectFit:
                      config.fitMode as any,

                    objectPosition:
                      ad.focalPoint ??
                      "center",
                  }}
                />
              )}
            </Box>
          </Fade>
        </Box>
      )}

      {/* ======================================================
       * CONTENT
       * ====================================================== */}

      {hasContent && (
        <Box
          sx={{
            position: "absolute",

            display: {
              xs: "none",
              md: "block",
            },

            left: {
              xs: 18,
              md: 28,
            },

            bottom: {
              xs: 16,
              md: 28,
            },

            zIndex: 15,

            width: {
              xs: "calc(100% - 36px)",
              sm: "fit-content",
            },

            maxWidth: {
              xs: "calc(100% - 36px)",
              md: 440,
            },
          }}
        >
          <Box
            sx={{
              p: {
                xs: 1.6,
                md: 2.4,
              },

              borderRadius: {
                xs: 3,
                md: 5,
              },

              background:
                {
                  xs: "rgba(15,23,42,.58)",
                  md: "rgba(15,23,42,.42)",
                },

              backdropFilter: "blur(16px)",

              border:
                "1px solid rgba(255,255,255,.08)",
            }}
          >
            {/* TITLE */}

            {hasTitle && (
              <Typography
                sx={{
                  fontWeight: 900,

                  lineHeight: 1.05,

                  letterSpacing: "-0.03em",

                  fontSize: {
                    xs: 20,
                    sm: 30,
                    md: 36,
                  },

                  color: "white",
                }}
              >
                {ad.title}
              </Typography>
            )}

            {/* SUBTITLE */}

            {hasSubtitle && (
              <Typography
                sx={{
                  mt: hasTitle ? 1.3 : 0,

                  color:
                    "rgba(255,255,255,.78)",

                  lineHeight: 1.55,

                  fontSize: {
                    xs: 12.5,
                    md: 15,
                  },
                }}
              >
                {ad.subtitle}
              </Typography>
            )}

            {/* CTA */}

            {hasCTA && (
              <Button
                onClick={handleClickCTA}
                sx={{
                  mt:
                    hasTitle ||
                    hasSubtitle
                      ? {
                        xs: 1.4,
                        md: 2.2,
                      }
                      : 0,

                  px: {
                    xs: 2,
                    md: 2.5,
                  },
                  py: {
                    xs: 0.85,
                    md: 1,
                  },

                  borderRadius: 999,

                  textTransform: "none",

                  fontWeight: 800,

                  color: "white",

                  background:
                    "linear-gradient(135deg,#f59e0b,#fb923c)",

                  boxShadow:
                    "0 10px 25px rgba(245,158,11,.35)",

                  transition:
                    "all .25s ease",

                  "&:hover": {
                    transform:
                      "translateY(-2px)",

                    boxShadow:
                      "0 14px 30px rgba(245,158,11,.42)",

                    background:
                      "linear-gradient(135deg,#f59e0b,#ea580c)",
                  },
                }}
              >
                {ad.cta}
              </Button>
            )}
          </Box>
        </Box>
      )}

      {/* ======================================================
       * CONTROLS
       * ====================================================== */}

      {!isMobile &&
        ads.length > 1 && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,

              display: "flex",
              alignItems: "center",
              justifyContent:
                "space-between",

              px: 2,

              zIndex: 20,

              opacity: isHovered ? 1 : 0,

              pointerEvents: isHovered
                ? "auto"
                : "none",

              transition:
                "opacity .25s ease",
            }}
          >
            <IconButton
              onClick={goPrev}
              sx={{
                width: 48,
                height: 48,

                color: "white",

                background:
                  "rgba(15,23,42,.55)",

                backdropFilter:
                  "blur(14px)",

                border:
                  "1px solid rgba(255,255,255,.08)",

                "&:hover": {
                  background:
                    "rgba(15,23,42,.8)",
                },
              }}
            >
              <ChevronLeft />
            </IconButton>

            <IconButton
              onClick={goNext}
              sx={{
                width: 48,
                height: 48,

                color: "white",

                background:
                  "rgba(15,23,42,.55)",

                backdropFilter:
                  "blur(14px)",

                border:
                  "1px solid rgba(255,255,255,.08)",

                "&:hover": {
                  background:
                    "rgba(15,23,42,.8)",
                },
              }}
            >
              <ChevronRight />
            </IconButton>
          </Box>
        )}

      {/* ======================================================
       * INDICATORS
       * ====================================================== */}

      {ads.length > 1 && (
        <Box
          sx={{
            position: "absolute",

            left: {
              xs: "auto",
              md: "50%",
            },
            right: {
              xs: 16,
              md: "auto",
            },
            top: {
              xs: 21,
              md: "auto",
            },
            bottom: {
              xs: "auto",
              md: 16,
            },

            transform:
              {
                xs: "none",
                md: "translateX(-50%)",
              },

            display: "flex",
            alignItems: "center",
            gap: 1,

            zIndex: 25,
          }}
        >
          {ads.map((_, i) => (
            <Box
              key={i}
              sx={{
                width:
                  i === index
                    ? 22
                    : 8,

                height: 8,

                borderRadius: 999,

                transition:
                  "all .3s ease",

                background:
                  i === index
                    ? "white"
                    : "rgba(255,255,255,.3)",
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
