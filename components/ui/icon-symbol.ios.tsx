// Use MaterialIcons as a safe fallback for iOS builds when `expo-symbols` isn't available.
// This keeps the bundler from failing during export. If you want native SF Symbols
// on iOS, install `expo-symbols` and restore the previous implementation.
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<string, ComponentProps<typeof MaterialIcons>["name"]>;

const MAPPING = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  person: "person",
} as IconMapping;

type IconSymbolName = keyof typeof MAPPING;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: unknown;
}) {
  // Map SF Symbol names to MaterialIcons; fallback to a generic icon if missing
  const mapped = (MAPPING as Record<string, string>)[name] ?? "help-outline";
  return (
    <MaterialIcons
      color={color as any}
      size={size}
      name={mapped as any}
      style={style}
    />
  );
}
