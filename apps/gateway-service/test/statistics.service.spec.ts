import { Test } from "@nestjs/testing";

describe('StatisticsService', () => {
    let service: StatisticsService;
    
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          providers: [StatisticsService],
        }).compile();
    
        service = module.get<StatisticsService>(StatisticsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return empty statistics for no recorded data', () => {
        const stats = service.GetTrafficSummary();
        expect(stats).toEqual({});
    });

    it('should handle multiple endpoints correctly', () => {
        service.RecordStatistics("/endpoint1", 200, 30);
        service.RecordStatistics("/endpoint1", 200, 40);
        service.RecordStatistics("/endpoint2", 404, 60);

        const stats = service.GetTrafficSummary();
        expect(stats).toEqual({
            "/endpoint1": {
                totalRequests: 2,
                averageResponseTime: 35,
                minResponseTime: 30,
                maxResponseTime: 40,
                statusCodeDistribution: {
                    "200": 2,
                },
            },
            "/endpoint2": {
                totalRequests: 1,
                averageResponseTime: 60,
                minResponseTime: 60,
                maxResponseTime: 60,
                statusCodeDistribution: {
                    "404": 1,
                },
            },
        });
    });
});