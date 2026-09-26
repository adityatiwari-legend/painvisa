"use client";

import React, { useRef, useState, useEffect } from "react";
import { Camera, RefreshCw, Check, X, AlertCircle, SwitchCamera } from "lucide-react";

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
  title: string;
  guideText?: string;
  aspectRatio?: "square" | "portrait" | "standard"; // portrait for passport, standard for aadhaar/thumb
}

export function CameraCaptureModal({
  isOpen,
  onClose,
  onCapture,
  title,
  guideText = "Position your document or face clearly within the frame under good lighting.",
  aspectRatio = "portrait",
}: CameraCaptureModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [capturedDataUrl, setCapturedDataUrl] = useState<string | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [isLoading, setIsLoading] = useState(false);

  // Initialize camera stream
  const startCamera = async (mode: "user" | "environment") => {
    setIsLoading(true);
    setCameraError(null);

    // Stop existing stream if running
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("Camera capture is not supported on this browser or requires a secure HTTPS connection.");
      setIsLoading(false);
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsLoading(false);
    } catch (err: unknown) {
      console.error("Camera access error:", err);
      const domError = err as DOMException;
      if (domError.name === "NotAllowedError" || domError.name === "PermissionDeniedError") {
        setCameraError("Camera access permission was denied. Please allow camera permissions in your browser settings to continue, or upload a photo directly.");
      } else if (domError.name === "NotFoundError" || domError.name === "DevicesNotFoundError") {
        setCameraError("No camera device was detected on your computer or mobile device.");
      } else {
        setCameraError(`Camera error: ${domError.message || "Could not initialize video feed."}`);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCapturedDataUrl(null);
      setCapturedBlob(null);
      startCamera(facingMode);
    } else {
      // Cleanup
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen, facingMode]);

  // Capture frame to canvas
  const handleTakeSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Flip horizontally if front-facing user camera for mirror effect
    if (facingMode === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setCapturedDataUrl(url);
          setCapturedBlob(blob);
        }
      },
      "image/jpeg",
      0.92
    );
  };

  const handleRetake = () => {
    if (capturedDataUrl) {
      URL.revokeObjectURL(capturedDataUrl);
    }
    setCapturedDataUrl(null);
    setCapturedBlob(null);
    startCamera(facingMode);
  };

  const handleUsePhoto = () => {
    if (!capturedBlob) return;
    const timestamp = Date.now();
    const file = new File([capturedBlob], `captured-${timestamp}.jpg`, {
      type: "image/jpeg",
    });
    onCapture(file);
    handleClose();
  };

  const handleToggleFacingMode = () => {
    const nextMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(nextMode);
  };

  const handleClose = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (capturedDataUrl) {
      URL.revokeObjectURL(capturedDataUrl);
    }
    setCapturedDataUrl(null);
    setCapturedBlob(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-neutral-200 flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-[#333638] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#C79A2B]" />
            <h3 className="font-bold text-sm tracking-wide">{title}</h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions banner */}
        <div className="px-5 py-2.5 bg-neutral-100 text-xs text-neutral-600 border-b border-neutral-200 flex items-center justify-between">
          <span>{guideText}</span>
          {!capturedDataUrl && !cameraError && (
            <button
              onClick={handleToggleFacingMode}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#333638] hover:text-[#C79A2B] bg-white px-2 py-1 rounded border border-neutral-300 shadow-2xs"
            >
              <SwitchCamera className="w-3.5 h-3.5" />
              Flip
            </button>
          )}
        </div>

        {/* Video / Snapshot Viewport */}
        <div className="relative bg-neutral-950 aspect-4/3 flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="p-6 text-center text-white max-w-xs space-y-3">
              <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
              <p className="text-xs text-neutral-300 leading-relaxed">{cameraError}</p>
              <button
                onClick={() => startCamera(facingMode)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs font-medium rounded-lg text-white transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Camera
              </button>
            </div>
          ) : capturedDataUrl ? (
            // Captured preview
            <div className="relative w-full h-full flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={capturedDataUrl}
                alt="Captured Snapshot"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-3 left-3 bg-emerald-600/90 text-white text-[11px] font-semibold px-2 py-1 rounded shadow">
                Preview captured photo
              </div>
            </div>
          ) : (
            // Live video stream
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${facingMode === "user" ? "-scale-x-100" : ""}`}
              />

              {/* Guide Overlay Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div
                  className={`border-2 border-dashed border-[#C79A2B]/80 rounded-xl ${
                    aspectRatio === "portrait"
                      ? "w-48 h-64"
                      : aspectRatio === "square"
                      ? "w-56 h-56"
                      : "w-64 h-48"
                  }`}
                />
              </div>

              {isLoading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs">
                  Initializing camera feed...
                </div>
              )}
            </div>
          )}
        </div>

        {/* Controls Footer */}
        <div className="p-4 bg-white border-t border-neutral-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {capturedDataUrl ? (
              <>
                <button
                  type="button"
                  onClick={handleRetake}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Retake
                </button>
                <button
                  type="button"
                  onClick={handleUsePhoto}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-[#C79A2B] hover:bg-[#B0851F] rounded-lg shadow-sm transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Use Photo
                </button>
              </>
            ) : (
              <button
                type="button"
                disabled={Boolean(cameraError) || isLoading}
                onClick={handleTakeSnapshot}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#C79A2B] hover:bg-[#B0851F] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all hover:shadow"
              >
                <Camera className="w-4 h-4" />
                Capture Photo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
