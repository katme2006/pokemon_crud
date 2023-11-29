from rest_framework.views import APIView
from rest_framework.response import Response
import requests # <== import requests so we can utilize it within our CBV to make API calls
from requests_oauthlib import OAuth1 #<== import OAuth1 which will essentially authenticate our keys when we send a request
from pokedex_proj.settings import env
import pprint

pp = pprint.PrettyPrinter(indent=2, depth=2)

class Noun_Project(APIView):
    def get(self, request, types):
        auth = OAuth1(env.get("API_KEY"), env.get("SECRET_KEY"))
        endpoint = f"https://api.thenounproject.com/v2/icon?query={types}"

        try:
            response = requests.get(endpoint, auth=auth)
            response.raise_for_status()
            responseJSON = response.json()
            pp.pprint(responseJSON)
            icons = responseJSON.get('icons', [])
            return Response({'thumbnails': [icon['thumbnail_url'] for icon in icons]})

        except requests.RequestException as e:
            # Handle HTTP errors
            return Response({'error': str(e)}, status=500)