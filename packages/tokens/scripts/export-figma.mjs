/**
 * Figma Token Export for Pixelmist Design System
 * Exports design tokens in Figma Variables format (JSON)
 * Usage: node scripts/export-figma.mjs
 * 
 * Figma Variables support:
 * - Primitive tokens (colors, spacing, typography, etc.)
 * - Semantic tokens (themes)
 * - Component tokens
 * 
 * Output: dist/figma-tokens.json
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import * as T from '../dist/index.js';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
mkdirSync(dist, { recursive: true });

const isRef = (v) => typeof v === 'string' && /^\{.+\}$/.test(v);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const refPath = (v) => v.replace(/^\{|\}$/g, '').replace(/\.DEFAULT(?=\.|$)/g, '');

/**
 * Convert a token value to Figma-compatible format
 */
function figmaValue(type, value) {
  if (type === 'color') {
    // Convert hex to Figma RGB format
    if (typeof value === 'string' && value.startsWith('#')) {
      const r = parseInt(value.slice(1, 3), 16) / 255;
      const g = parseInt(value.slice(3, 5), 16) / 255;
      const b = parseInt(value.slice(5, 7), 16) / 255;
      return { r, g, b, a: 1 };
    }
    // Handle rgba - check if value is a string first
    if (typeof value === 'string') {
      const rgbaMatch = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (rgbaMatch) {
        return {
          r: parseInt(rgbaMatch[1], 10) / 255,
          g: parseInt(rgbaMatch[2], 10) / 255,
          b: parseInt(rgbaMatch[3], 10) / 255,
          a: rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1,
        };
      }
    }
    return value;
  }
  
  if (type === 'dimension') {
    return typeof value === 'number' ? value : parseFloat(value) || 0;
  }
  
  if (type === 'string') {
    return String(value);
  }
  
  if (type === 'number') {
    return typeof value === 'number' ? value : parseFloat(value) || 0;
  }
  
  return value;
}

/**
 * Determine Figma variable type from token path
 */
function getFigmaType(path) {
  if (path.includes('color') || path.includes('bg') || path.includes('fg') || path.includes('accent') || path.includes('border') || path.includes('status') || path.includes('gradient')) {
    return 'color';
  }
  if (path.includes('spacing') || path.includes('space') || path.includes('radius') || path.includes('elevation') || path.includes('layout')) {
    return 'dimension';
  }
  if (path.includes('font') || path.includes('typography') || path.includes('text')) {
    return 'string';
  }
  if (path.includes('motion') || path.includes('duration') || path.includes('zIndex')) {
    return 'number';
  }
  return 'string';
}

/**
 * Build Figma Variables structure
 */
function buildFigmaTokens() {
  const variables = {};
  const variableIds = {};
  let counter = 0;
  
  // Helper to create variable ID
  const getVarId = (name) => {
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    if (!variableIds[cleanName]) {
      variableIds[cleanName] = `pm_${cleanName}_${counter++}`;
    }
    return variableIds[cleanName];
  };
  
  // Process palette colors (primitives)
  const flatPrimitives = T.flatten({
    palette: T.palette,
    font: T.fonts,
    text: T.textScale,
    space: T.spacing,
    radius: T.radius,
    elevation: T.elevation,
    motion: T.motion,
    layout: T.layout,
  });
  
  // Add primitive tokens as Figma variables
  for (const [path, value] of Object.entries(flatPrimitives)) {
    if (isRef(value)) continue;
    
    const name = `primitives/${path.replace(/\./g, '/')}`;
    const type = getFigmaType(path);
    const varId = getVarId(path);
    
    variables[varId] = {
      name,
      type,
      value: figmaValue(type, value),
      description: `Pixelmist primitive token: ${path}`,
    };
  }
  
  // Add semantic tokens per theme
  for (const themeName of T.themeNames) {
    const semantic = T.themes[themeName];
    const flatSemantic = T.flatten({ color: semantic });
    
    for (const [path, value] of Object.entries(flatSemantic)) {
      if (isRef(value)) continue;
      
      const name = `semantic/${themeName}/${path.replace(/\./g, '/').replace(/^color\//, '')}`;
      const type = getFigmaType(path);
      const varId = getVarId(`${themeName}_${path}`);
      
      variables[varId] = {
        name,
        type,
        value: figmaValue(type, value),
        description: `Pixelmist semantic token: ${themeName}.${path}`,
      };
    }
  }
  
  // Add component tokens
  const flatComponents = T.flatten({ components: T.componentTokens });
  for (const [path, value] of Object.entries(flatComponents)) {
    if (isRef(value)) continue;
    
    const name = `components/${path.replace(/\./g, '/').replace(/^components\//, '')}`;
    const type = getFigmaType(path);
    const varId = getVarId(`comp_${path}`);
    
    variables[varId] = {
      name,
      type,
      value: figmaValue(type, value),
      description: `Pixelmist component token: ${path}`,
    };
  }
  
  return {
    $meta: {
      name: '@pixelmist/tokens',
      version: '0.2.0',
      generatedAt: new Date().toISOString(),
      description: 'Pixelmist Design System tokens for Figma Variables',
    },
    variables,
    // Figma Sets for organization
    sets: {
      primitives: Object.keys(variables)
        .filter((id) => variables[id].name.startsWith('primitives/'))
        .map((id) => ({ id, name: variables[id].name })),
      semantic: Object.keys(variables)
        .filter((id) => variables[id].name.startsWith('semantic/'))
        .map((id) => ({ id, name: variables[id].name })),
      components: Object.keys(variables)
        .filter((id) => variables[id].name.startsWith('components/'))
        .map((id) => ({ id, name: variables[id].name })),
    },
  };
}

const figmaTokens = buildFigmaTokens();
const outputPath = join(dist, 'figma-tokens.json');
writeFileSync(outputPath, JSON.stringify(figmaTokens, null, 2));

console.log(`Figma tokens exported: ${Object.keys(figmaTokens.variables).length} variables written to ${outputPath}`);
