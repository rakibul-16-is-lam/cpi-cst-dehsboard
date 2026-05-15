from django.db import models

class Notice(models.Model):
    TYPES = (('info', 'Information'), ('warning', 'Warning'))
    text = models.TextField()
    type = models.CharField(max_length=20, choices=TYPES, default='info')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.text[:50]

class Leaderboard(models.Model):
    name = models.CharField(max_length=100)
    batch = models.CharField(max_length=50)
    score = models.FloatField()
    avatar = models.CharField(max_length=10, default='🎓')

    class Meta:
        ordering = ['-score']

class Placement(models.Model):
    student = models.CharField(max_length=100)
    company = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    year = models.CharField(max_length=10)

class AppStatistic(models.Model):
    total_students = models.IntegerField(default=0)
    active_students = models.IntegerField(default=0)
    alumni = models.IntegerField(default=0)
    placement_rate = models.IntegerField(default=0)
    performance_index = models.FloatField(default=3.85)

    class Meta:
        verbose_name_plural = "App Statistics"
