import React from 'react';
import type { CdnTemplateEntry } from '../types';

export interface TemplateBundleExport {
  TemplatePage: React.ComponentType;
  manifest: CdnTemplateEntry;
}

// ─── Registry fetch ───────────────────────────────────────────────────────────

const _registryCache = new Map<string, CdnTemplateEntry[]>();

export async function fetchCdnRegistry(registryUrl: string): Promise<CdnTemplateEntry[]> {
  const cached = _registryCache.get(registryUrl);
  if (cached) return cached;
  const res = await fetch(registryUrl);
  if (!res.ok) throw new Error(`Failed to fetch template registry: ${res.status}`);
  const entries = (await res.json()) as CdnTemplateEntry[];
  _registryCache.set(registryUrl, entries);
  return entries;
}

// ─── Dynamic bundle loader ────────────────────────────────────────────────────

const _loadedBundles = new Map<string, TemplateBundleExport>();

function injectScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-temanten-bundle="${src}"]`)) {
      resolve();
      return;
    }
    const el = document.createElement('script');
    el.src = src;
    el.dataset.temantanBundle = src;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error(`Failed to load template bundle: ${src}`));
    document.head.appendChild(el);
  });
}

function injectStylesheet(href: string): void {
  if (document.querySelector(`link[data-temanten-css="${href}"]`)) return;
  const el = document.createElement('link');
  el.rel = 'stylesheet';
  el.href = href;
  el.dataset.temantanCss = href;
  document.head.appendChild(el);
}

function umdGlobalName(slug: string): string {
  // "jogja-1" → "TemantanTemplate_jogja1"
  return `TemantanTemplate_${slug.replace(/-/g, '')}`;
}

export async function loadCdnTemplate(entry: CdnTemplateEntry): Promise<TemplateBundleExport> {
  if (_loadedBundles.has(entry.slug)) {
    return _loadedBundles.get(entry.slug)!;
  }

  if (entry.cssUrl) injectStylesheet(entry.cssUrl);
  await injectScript(entry.bundleUrl);

  const globalName = umdGlobalName(entry.slug);
  const bundle = (window as unknown as Record<string, unknown>)[globalName] as TemplateBundleExport | undefined;
  if (!bundle?.TemplatePage) {
    throw new Error(
      `Template bundle for "${entry.slug}" did not export TemplatePage (expected window.${globalName})`
    );
  }

  _loadedBundles.set(entry.slug, bundle);
  return bundle;
}

export async function loadCdnTemplateBySlug(
  slug: string,
  registryUrl: string
): Promise<TemplateBundleExport> {
  const registry = await fetchCdnRegistry(registryUrl);
  const entry = registry.find((e) => e.slug === slug);
  if (!entry) throw new Error(`Template "${slug}" not found in CDN registry`);
  return loadCdnTemplate(entry);
}

export function createLazyCdnTemplate(
  entry: CdnTemplateEntry
): React.LazyExoticComponent<React.ComponentType> {
  return React.lazy(async () => {
    const { TemplatePage } = await loadCdnTemplate(entry);
    return { default: TemplatePage };
  });
}
