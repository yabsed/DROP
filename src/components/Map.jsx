import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { LAYER, SPOTS } from '../utils/data';

export function Map({ layer, isDropMode, drops, onMapClick, onMarkerClick, setMapReady, setMapError }) {
  const mapNode = useRef(null);
  const mapRef = useRef(null);
  const markerGroupRef = useRef(null);
  const layerRef = useRef(layer);
  const isDropModeRef = useRef(isDropMode);

  useEffect(() => {
    layerRef.current = layer;
  }, [layer]);

  useEffect(() => {
    isDropModeRef.current = isDropMode;
  }, [isDropMode]);

  useEffect(() => {
    if (!mapNode.current || mapRef.current) return;

    try {
      if (mapNode.current._leaflet_id) {
        mapNode.current._leaflet_id = null;
      }

      const map = L.map(mapNode.current, { zoomControl: false }).setView([37.5271, 126.9326], 15);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(map);
      const group = L.layerGroup().addTo(map);

      const rafId = requestAnimationFrame(() => {
        map.invalidateSize();
      });

      const resizeHandler = () => map.invalidateSize();
      window.addEventListener('resize', resizeHandler);

      mapRef.current = map;
      markerGroupRef.current = group;
      setMapReady(true);
      setMapError('');

      map.on('click', (event) => {
        if (!isDropModeRef.current || layerRef.current !== LAYER.DROP) return;
        onMapClick(event.latlng);
      });

      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', resizeHandler);
        map.remove();
        mapRef.current = null;
        markerGroupRef.current = null;
        setMapReady(false);
      };
    } catch (error) {
      setMapError('지도를 불러오지 못했습니다. 새로고침 후 다시 시도해주세요.');
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current || layer === LAYER.RECORD) return;
    mapRef.current.invalidateSize();
  }, [layer]);

  useEffect(() => {
    if (!mapRef.current || !markerGroupRef.current) return;
    markerGroupRef.current.clearLayers();

    if (layer === LAYER.DROP) {
      drops.forEach((drop) => {
        const icon = L.divIcon({
          className: 'emoji-pin-wrapper',
          html: `<div class="emoji-pin">${drop.emoji}</div>`,
          iconSize: [44, 44]
        });
        const marker = L.marker([drop.lat, drop.lng], { icon });
        marker.on('click', () => {
            onMarkerClick({ type: 'drop', id: drop.id, data: drop });
        });
        marker.addTo(markerGroupRef.current);
      });
      return;
    }

    if (layer === LAYER.PLACE) {
      SPOTS.forEach((spot) => {
        const icon = L.divIcon({
          className: 'emoji-pin-wrapper',
          html: `<div class="emoji-pin">${spot.emoji}</div>`,
          iconSize: [44, 44]
        });
        const marker = L.marker([spot.lat, spot.lng], { icon });
        marker.on('click', () => {
            onMarkerClick({
            type: 'place',
            id: spot.id,
            data: { text: spot.name, emoji: spot.emoji, createdAt: Date.now() }
          });
        });
        marker.addTo(markerGroupRef.current);
      });
    }
  }, [layer, drops]);

  return <div ref={mapNode} className={`map ${layer === LAYER.RECORD ? 'hidden' : ''}`} />;
}
