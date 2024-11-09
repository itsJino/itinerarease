# import_places.py
import csv
from django.core.management.base import BaseCommand
from pubs.models import PublicPlace

class Command(BaseCommand):
    help = 'Import public places from a CSV file'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='The path to the CSV file to be imported')

    def handle(self, *args, **kwargs):
        csv_file_path = kwargs['csv_file']
        with open(csv_file_path, mode='r') as csv_file:
            reader = csv.DictReader(csv_file)
            places = [
                PublicPlace(
                    id=row['ID'],
                    name=row['name'],
                    longitude=row['long'],
                    latitude=row['lat'],
                    region=row['region']
                ) for row in reader
            ]
            PublicPlace.objects.bulk_create(places, ignore_conflicts=True)
        self.stdout.write(self.style.SUCCESS('Successfully imported data from CSV'))
