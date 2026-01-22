import React from "react";

export interface ProjectHeaderMinimalProps {
  logoUrl?: string;
  name: string;
  symbol?: string;
  stage: "MVP 进行中" | "已上线运营";
  chain: string;
  supporters: number;
  raisedUsd: number;
  website?: string;
  twitter?: string;
  github?: string;
  docs?: string;
  onSupportClick?: () => void;
}

export const ProjectHeaderMinimal: React.FC<ProjectHeaderMinimalProps> = ({
  logoUrl,
  name,
  symbol,
  stage,
  chain,
  supporters,
  raisedUsd,
  website,
  twitter,
  github,
  docs,
  onSupportClick,
}) => {
  return (
    <div className="flex flex-col gap-2 border-b border-slate-800 bg-slate-950/80 px-4 py-3 md:flex-row md:items-center md:justify-between">
      {/* 左侧：项目基本信息 */}
      <div className="flex items-center gap-3 min-w-0">
        {logoUrl && (
          <img
            src={logoUrl}
            alt={name}
            className="h-9 w-9 rounded-full object-cover"
          />
        )}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-semibold text-slate-50">
              {name}
            </span>
            {symbol && (
              <span className="rounded-full bg-slate-800 px-2 text-xs text-slate-300">
                {symbol}
              </span>
            )}
            <span className="rounded-full bg-violet-600/90 px-2 text-xs text-white">
              {stage}
            </span>
            <span className="rounded-full bg-slate-800 px-2 text-xs text-slate-200">
              链：{chain}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-400 truncate">
            <span className="truncate">
              面向高杠杆散户的链上清算保护工具 · 1 USD Accelerator
            </span>
          </div>
        </div>
      </div>

      {/* 右侧：数字 + 链接 + 按钮 */}
      <div className="flex flex-col items-end gap-1 text-right md:flex-row md:items-center md:gap-4">
        {/* 数字区：模仿价格/池子/成交量 */}
        <div className="flex flex-row flex-wrap items-center gap-3 text-xs text-slate-300">
          <span>
            已筹 <span className="font-semibold">${raisedUsd}</span>
          </span>
          <span>
            支持者 <span className="font-semibold">{supporters}</span>
          </span>
          <span className="hidden sm:inline">
            起投 <span className="font-semibold">$1</span>
          </span>
        </div>

        {/* 链接 icon 区 */}
        <div className="flex items-center gap-1">
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:border-slate-500"
            >
              官网
            </a>
          )}
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:border-slate-500"
            >
              GitHub
            </a>
          )}
          {twitter && (
            <a
              href={twitter}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:border-slate-500"
            >
              X
            </a>
          )}
          {docs && (
            <a
              href={docs}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:border-slate-500"
            >
              Docs
            </a>
          )}

          {/* 主操作按钮：支持 1 美元 */}
          <button
            onClick={onSupportClick}
            className="ml-1 rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white hover:bg-violet-500"
          >
            支持 1 美元
          </button>
        </div>
      </div>
    </div>
  );
};