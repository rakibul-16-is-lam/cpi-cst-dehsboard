from rest_framework import viewsets, permissions
from .models import Notice, Leaderboard, Placement, AppStatistic
from .serializers import NoticeSerializer, LeaderboardSerializer, PlacementSerializer, StatSerializer

class NoticeViewSet(viewsets.ModelViewSet):
    queryset = Notice.objects.all().order_by('-created_at')
    serializer_class = NoticeSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

class DashboardStatsView(viewsets.ReadOnlyModelViewSet):
    queryset = AppStatistic.objects.all()
    serializer_class = StatSerializer
    # This would typically return just the single stats object
