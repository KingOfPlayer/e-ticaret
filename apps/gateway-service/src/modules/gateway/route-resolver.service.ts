import { Injectable, NotFoundException } from '@nestjs/common';
import { ROUTE_MAP } from '../../common/constants/route-map.constant';

@Injectable()
export class RouteResolverService {
  resolveService(path: string): { url: string; prefix: string } {
    const route = Object.keys(ROUTE_MAP).find((r) => path.startsWith(r));

    if (!route) {
      throw new NotFoundException(`Route not found for path: ${path}`);
    }

    return { url: (ROUTE_MAP as Record<string, string>)[route], prefix: route };
  }
}
