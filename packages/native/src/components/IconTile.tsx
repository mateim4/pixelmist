import { View } from 'react-native';
import type { ViewProps } from 'react-native';
import type { IconName } from '@pixelmist/icons';
import { useTheme } from '../theme/ThemeProvider';
import { asTokens } from '../theme/helpers';
import { Icon } from './Icon';

export interface IconTileProps extends ViewProps {
  icon: IconName;
  label?: string;
}

export function IconTile({ icon, label, style, ...rest }: IconTileProps) {
  const { resolved: t } = useTheme();
  return (
    <View
      accessibilityLabel={label}
      style={{
        width: Number(asTokens(t.components.iconTile).size), height: Number(asTokens(t.components.iconTile).size),
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: String(asTokens(t.components.iconTile).bg),
        borderWidth: 1, borderColor: String(asTokens(t.components.iconTile).border),
        borderRadius: Number(asTokens(t.components.iconTile).radius),
      }}
      {...rest}
    >
      <Icon name={icon} size={20} color={t.color.accent.primary} />
    </View>
  );
}
