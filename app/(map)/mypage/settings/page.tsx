"use client";

import { useCallback, useSyncExternalStore } from "react";
import { toast } from "sonner";
import { AccountPageShell } from "@/features/account/components/account-page-shell";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const SETTINGS_KEY = "fan-map:settings";
const SETTINGS_CHANGED_EVENT = "fan-map:settings-changed";

type AppSettings = {
  notifyNotice: boolean;
  notifyReport: boolean;
};

const defaultSettings: AppSettings = {
  notifyNotice: true,
  notifyReport: true,
};

let settingsSnapshot: AppSettings = defaultSettings;
let settingsSnapshotRaw: string | null = null;

function parseSettings(raw: string | null): AppSettings {
  if (!raw) return defaultSettings;
  try {
    return { ...defaultSettings, ...(JSON.parse(raw) as AppSettings) };
  } catch {
    return defaultSettings;
  }
}

function getSettingsSnapshot(): AppSettings {
  const raw = localStorage.getItem(SETTINGS_KEY);
  if (raw === settingsSnapshotRaw) return settingsSnapshot;
  settingsSnapshotRaw = raw;
  settingsSnapshot = parseSettings(raw);
  return settingsSnapshot;
}

function subscribeSettings(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(SETTINGS_CHANGED_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(SETTINGS_CHANGED_EVENT, onStoreChange);
  };
}

function writeSettings(next: AppSettings) {
  const raw = JSON.stringify(next);
  localStorage.setItem(SETTINGS_KEY, raw);
  settingsSnapshot = next;
  settingsSnapshotRaw = raw;
  window.dispatchEvent(new Event(SETTINGS_CHANGED_EVENT));
}

export default function SettingsPage() {
  const settings = useSyncExternalStore(
    subscribeSettings,
    getSettingsSnapshot,
    () => defaultSettings,
  );

  const update = useCallback(
    <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
      writeSettings({ ...settings, [key]: value });
      toast.success("설정을 저장했습니다.");
    },
    [settings],
  );

  return (
    <AccountPageShell
      title="설정"
      description="알림과 계정 관련 설정을 관리합니다."
    >
      <Card className="gap-0 divide-y py-0" size="sm">
        <div className="flex items-center justify-between gap-3 px-(--card-spacing) py-3">
          <div>
            <Label htmlFor="notify-notice">공지 알림</Label>
            <p className="text-muted-foreground text-xs">
              새 공지가 등록되면 알려 줍니다. (Mock)
            </p>
          </div>
          <Switch
            id="notify-notice"
            checked={settings.notifyNotice}
            onCheckedChange={(checked) => update("notifyNotice", checked)}
          />
        </div>
        <div className="flex items-center justify-between gap-3 px-(--card-spacing) py-3">
          <div>
            <Label htmlFor="notify-report">방문 경험 관련 안내</Label>
            <p className="text-muted-foreground text-xs">
              방문 경험 처리·안내 메시지를 받습니다. (Mock)
            </p>
          </div>
          <Switch
            id="notify-report"
            checked={settings.notifyReport}
            onCheckedChange={(checked) => update("notifyReport", checked)}
          />
        </div>
      </Card>
    </AccountPageShell>
  );
}
