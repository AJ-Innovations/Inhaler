import React from "react";

export function SocialAuth() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button className="group flex h-14 items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.03] text-gray-500 transition-all hover:bg-white/5 hover:text-white active:scale-95">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-white transition-transform group-hover:scale-110"
        >
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09zM12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23zM5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85zM12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
        <span className="text-[9px] font-black tracking-widest text-gray-500 uppercase transition-colors group-hover:text-white">
          Google
        </span>
      </button>
      <button className="group flex h-14 items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.03] text-gray-500 transition-all hover:bg-white/5 hover:text-white active:scale-95">
        <svg
          width="15"
          height="18"
          viewBox="0 0 256 315"
          fill="currentColor"
          className="text-white transition-transform group-hover:scale-110"
        >
          <path d="M213.803 167.03c.442 47.58 41.74 63.413 42.147 63.615-.35 1.116-6.599 22.563-21.757 44.716-13.104 19.153-26.705 38.235-48.13 38.63-21.05.394-27.815-12.44-51.848-12.44-24.032 0-31.504 12.047-51.456 12.834-20.741.786-36.64-21.123-49.854-40.215-27.017-39.041-47.652-110.192-19.828-158.451 13.82-24.02 38.53-39.223 65.333-39.617 20.346-.393 39.512 13.71 52.032 13.71 12.522 0 35.844-16.913 60.604-14.44 10.387.43 39.589 4.184 58.293 31.593-1.496.932-34.881 20.32-34.453 60.038zM174.17 49.303c11.091-13.43 18.594-32.131 16.554-50.803-16.038.645-35.414 10.68-46.913 24.11-10.313 11.954-19.34 31.065-16.902 49.336 17.904 1.389 36.174-9.213 47.261-22.643z" />
        </svg>
        <span className="text-[9px] font-black tracking-widest text-gray-500 uppercase transition-colors group-hover:text-white">
          Apple ID
        </span>
      </button>
    </div>
  );
}
