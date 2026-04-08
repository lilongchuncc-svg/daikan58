import { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Loader2, ExternalLink } from 'lucide-react';

const TENCENT_MAP_KEY = 'NGYBZ-ZUBCT-DOBXW-VY66F-OYMMJ-RKBBF';

// 吉林市各区域中心点坐标
const DISTRICT_CENTERS: Record<string, { lat: number; lng: number }> = {
  '船营区': { lat: 43.8348, lng: 126.5608 },
  '昌邑区': { lat: 43.8508, lng: 126.5663 },
  '龙潭区': { lat: 43.9108, lng: 126.5603 },
  '丰满区': { lat: 43.8138, lng: 126.5583 },
  '高新区': { lat: 43.8288, lng: 126.5983 },
  '经开区': { lat: 43.8698, lng: 126.5893 },
  '舒兰市': { lat: 44.4167, lng: 126.9650 },
  '磐石市': { lat: 42.9423, lng: 126.0440 },
  '蛟河市': { lat: 43.7236, lng: 127.3442 },
};

// 吉林市小区预定义坐标库
const COMMUNITY_COORDS: Record<string, { lat: number; lng: number }> = {
  '江湾城': { lat: 43.8258, lng: 126.5558 },
  '吉林大街家园': { lat: 43.8428, lng: 126.5688 },
  '万达华府': { lat: 43.8398, lng: 126.5728 },
  '解放大路小区': { lat: 43.8368, lng: 126.5618 },
  '北京路豪苑': { lat: 43.8388, lng: 126.5598 },
  '昌邑老街坊': { lat: 43.8538, lng: 126.5698 },
  '碧桂园星樾': { lat: 43.8468, lng: 126.5808 },
  '昌邑新苑': { lat: 43.8558, lng: 126.5738 },
  '昌邑街道小区': { lat: 43.8518, lng: 126.5658 },
  '龙腾家园': { lat: 43.9138, lng: 126.5638 },
  '工人新村': { lat: 43.9088, lng: 126.5588 },
  '龙潭新城': { lat: 43.9158, lng: 126.5688 },
  '龙潭新苑': { lat: 43.9188, lng: 126.5618 },
  '松花湖国际城': { lat: 43.8188, lng: 126.5488 },
  '丰满生态城': { lat: 43.8108, lng: 126.5628 },
  '丰满学府苑': { lat: 43.8168, lng: 126.5708 },
  '高新科技城': { lat: 43.8298, lng: 126.5958 },
  '高新苑': { lat: 43.8318, lng: 126.6008 },
  '高新家园': { lat: 43.8278, lng: 126.5988 },
  '金地自在城': { lat: 43.8238, lng: 126.5858 },
  '经开新天地': { lat: 43.8688, lng: 126.5888 },
  '经开老城区': { lat: 43.8728, lng: 126.5928 },
  '中凯梦之城': { lat: 43.8408, lng: 126.5768 },
  '中东七彩城': { lat: 43.8558, lng: 126.5788 },
  '紫光名苑': { lat: 43.8438, lng: 126.5638 },
  '阳光广场': { lat: 43.8418, lng: 126.5718 },
  '世纪广场': { lat: 43.8388, lng: 126.5748 },
};

interface MapComponentProps {
  community: string;
  district: string;
}

interface GeoResult {
  lat: number;
  lng: number;
  address: string;
}

export default function MapComponent({ community, district }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [geo, setGeo] = useState<GeoResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 获取坐标：优先从预定义库获取，否则使用区域中心点
  useEffect(() => {
    const getCoordinates = (): GeoResult => {
      // 1. 先在预定义坐标库中查找
      const communityKey = Object.keys(COMMUNITY_COORDS).find(
        key => community.includes(key) || key.includes(community)
      );
      if (communityKey) {
        return {
          lat: COMMUNITY_COORDS[communityKey].lat,
          lng: COMMUNITY_COORDS[communityKey].lng,
          address: communityKey + '（' + district + '）',
        };
      }

      // 2. 否则使用区域中心点
      const districtKey = Object.keys(DISTRICT_CENTERS).find(
        d => district.includes(d) || d.includes(district)
      );
      const center = districtKey ? DISTRICT_CENTERS[districtKey] : { lat: 43.8377, lng: 126.5494 };
      
      return {
        lat: center.lat + (Math.random() - 0.5) * 0.01, // 添加小幅随机偏移避免重叠
        lng: center.lng + (Math.random() - 0.5) * 0.01,
        address: community + '（' + district + '）',
      };
    };

    // 模拟加载延迟
    const timer = setTimeout(() => {
      const coords = getCoordinates();
      setGeo(coords);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [community, district]);

  // Initialize map once geo data is ready
  useEffect(() => {
    if (!geo || !mapRef.current || mapInstanceRef.current) return;

    const loadMap = () => {
      if (!(window as any).TMap) {
        setTimeout(loadMap, 300);
        return;
      }

      const center = new (window as any).TMap.LatLng(geo.lat, geo.lng);

      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
      }

      mapInstanceRef.current = new (window as any).TMap(mapRef.current, {
        center,
        zoom: 16,
        mapStyle: 'normal',
      });

      markerRef.current = new (window as any).TMap.MultiMarker({
        id: 'marker-layer',
        map: mapInstanceRef.current,
        styles: {
          marker: new (window as any).TMap.MarkerStyle({
            width: 32,
            height: 40,
            anchor: { x: 16, y: 40 },
            src: 'https://mapapi.qq.com/web/mapcomponents/locationMarker/img/marker_red.png',
          }),
        },
        geometries: [
          {
            id: 'main',
            styleId: 'marker',
            position: center,
          },
        ],
      });


    };

    // Load Tencent Maps JS SDK if not already loaded
    if (!(window as any).TMap) {
      const sdkScript = document.createElement('script');
      sdkScript.src = 'https://map.qq.com/api/gljs?v=1.exp&key=' + TENCENT_MAP_KEY;
      sdkScript.onload = loadMap;
      sdkScript.onerror = () => setError('地图服务加载失败');
      document.body.appendChild(sdkScript);
    } else {
      loadMap();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [geo]);

  const openInBrowser = () => {
    if (!geo) return;
    const url = `https://apis.map.qq.com/uri/v1/marker?marker=coord:${geo.lat},${geo.lng};title:${encodeURIComponent(community)};addr:${encodeURIComponent(geo.address)}&referer=安鑫看房`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm">
      <div className="px-5 pt-4 pb-2">
        <h2 className="font-bold text-gray-800 text-base flex items-center gap-2">
          <MapPin size={18} className="text-primary-600" />
          小区位置
        </h2>
      </div>

      {/* Community name & address */}
      {geo && (
        <div className="px-5 pb-3 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-700">{community}</div>
            <div className="text-xs text-gray-400 mt-0.5">{geo.address}</div>
          </div>
          <button
            onClick={openInBrowser}
            className="flex items-center gap-1.5 text-xs bg-primary-100 text-primary-700 px-3 py-1.5 rounded-full hover:bg-primary-200 transition-colors font-medium"
          >
            <MapPin size={14} />
            查看位置
          </button>
        </div>
      )}

      {/* Map container */}
      <div className="relative">
        <div
          ref={mapRef}
          style={{ width: '100%', height: '320px', background: '#f0f4f8' }}
        />

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
            <Loader2 size={28} className="text-primary-500 animate-spin mb-2" />
            <span className="text-sm text-gray-500">正在定位小区位置...</span>
          </div>
        )}

        {/* Error overlay */}
        {error && !loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
            <MapPin size={32} className="text-gray-300 mb-2" />
            <span className="text-sm text-gray-400">{error}</span>
            <span className="text-xs text-gray-300 mt-1">吉林市 {community}</span>
            <a
              href={`https://map.qq.com/?keyword=${encodeURIComponent(community + '吉林')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-xs text-primary-500 hover:underline"
            >
              在腾讯地图中查看 →
            </a>
          </div>
        )}

        {/* Map brand */}
        {!loading && !error && (
          <div className="absolute bottom-1 right-1">
            <a
              href="https://lbs.qq.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-gray-300 hover:text-gray-400"
            >
              腾讯地图
            </a>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      {geo && (
        <div className="flex gap-2 px-4 pb-4 pt-3">
          <a
            href={`https://map.qq.com/dir/?from=coord:${geo.lat},${geo.lat}&type=walk&to=${community}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-xs bg-primary-50 text-primary-600 py-2.5 rounded-lg hover:bg-primary-100 transition-colors font-medium"
          >
            🧭 步行导航
          </a>
          <a
            href={`https://map.qq.com/dir/?from=mylocation&type=drive&to=${encodeURIComponent(community)},${geo.lat},${geo.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-xs bg-blue-50 text-blue-600 py-2.5 rounded-lg hover:bg-blue-100 transition-colors font-medium"
          >
            🚗 驾车导航
          </a>
        </div>
      )}
    </div>
  );
}
