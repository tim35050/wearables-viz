#! /usr/bin/env python

__author__ = 'Timothy Meyers'
__email__ = 'tim35050@gmail.com'
__python_version = '2.7.2'
__can_anonymously_use_as_example = True

import urllib2
import re
from string import maketrans
from bs4 import BeautifulSoup
import json

class Crawler:
	''' Crawls all links starting from a given URL '''

	base_url = 'http://courses.ischool.berkeley.edu/i206/f13/a6-sandbox/'
	product_urls = [
			"http://vandrico.com/device/3l-labs-footlogger",
			"http://vandrico.com/device/4d-force",
			"http://vandrico.com/device/4iiii-viiiiva",
			"http://vandrico.com/device/9solutions-ipcs-products",
			"http://vandrico.com/device/adidas-smart-run",
			"http://vandrico.com/device/agent-smartwatch",
			"http://vandrico.com/device/air-scouter",
			"http://vandrico.com/device/airo",
			"http://vandrico.com/device/amiigo-fitness-band",
			"http://vandrico.com/device/aquapulse-heart-rate-monitor",
			"http://vandrico.com/device/atheer-one",
			"http://vandrico.com/device/athos",
			"http://vandrico.com/device/atlas-fitness-tracker",
			"http://vandrico.com/device/avegant-glyph",
			"http://vandrico.com/device/basis-b1",
			"http://vandrico.com/device/be-bionic",
			"http://vandrico.com/device/beartek-bluetooth-gloves",
			"http://vandrico.com/device/bia-sports-watch",
			"http://vandrico.com/device/bioharness-3",
			"http://vandrico.com/device/bionym-nymi-wristband",
			"http://vandrico.com/device/biopatch",
			"http://vandrico.com/device/bodymedia-link-armband",
			"http://vandrico.com/device/bpm-physio",
			"http://vandrico.com/device/bsx-insight",
			"http://vandrico.com/device/bts-surface-emg",
			"http://vandrico.com/device/buhel-helmet-communication-system",
			"http://vandrico.com/device/buhel-speakglasses",
			"http://vandrico.com/device/buhel-speakgoggle",
			"http://vandrico.com/device/casio-g-shock-gb-6900",
			"http://vandrico.com/device/castar",
			"http://vandrico.com/device/catapult-nanotrak",
			"http://vandrico.com/device/catapult-optimeye-s5",
			"http://vandrico.com/device/cinemizer-oled",
			"http://vandrico.com/device/connectedevice-cogito-watch",
			"http://vandrico.com/device/connectedevice-cookoo",
			"http://vandrico.com/device/cuff",
			"http://vandrico.com/device/cyberdyne-hal",
			"http://vandrico.com/device/dorsa-vi",
			"http://vandrico.com/device/duo-fertility",
			"http://vandrico.com/device/easywakeme",
			"http://vandrico.com/device/ekso-bionics",
			"http://vandrico.com/device/electricfoxy-move",
			"http://vandrico.com/device/electricfoxy-pulse",
			"http://vandrico.com/device/elocator-checkpoint",
			"http://vandrico.com/device/emotiv-neuroheadset",
			"http://vandrico.com/device/epson-moverio-bt-200",
			"http://vandrico.com/device/epson-pulsense-watch",
			"http://vandrico.com/device/epson-pulsense-wristband",
			"http://vandrico.com/device/eyetap-digital-eye-glasses",
			"http://vandrico.com/device/eyetap-hdr-cybernetic-welding-helmet",
			"http://vandrico.com/device/fashionteq-zazzi",
			"http://vandrico.com/device/fatigue-science-readiband",
			"http://vandrico.com/device/filip-smartwatch",
			"http://vandrico.com/device/fin-thumbring",
			"http://vandrico.com/device/fitbark-tracker",
			"http://vandrico.com/device/fitbit-flex",
			"http://vandrico.com/device/fitbit-force",
			"http://vandrico.com/device/fitbit-one",
			"http://vandrico.com/device/fitbug-orb",
			"http://vandrico.com/device/fly-fit",
			"http://vandrico.com/device/fujitsu-glove-style-wearable-device",
			"http://vandrico.com/device/funiki-ambient-glasses",
			"http://vandrico.com/device/game-golf",
			"http://vandrico.com/device/garmin-approach-s3",
			"http://vandrico.com/device/garmin-forerunner-gps-heart-rate-watch",
			"http://vandrico.com/device/garmin-vivofit",
			"http://vandrico.com/device/geak-ring",
			"http://vandrico.com/device/geopalz-ibitz",
			"http://vandrico.com/device/glassup",
			"http://vandrico.com/device/gobe-activity-monitor",
			"http://vandrico.com/device/google-glass",
			"http://vandrico.com/device/goqii-activity-band",
			"http://vandrico.com/device/hc1-headset-computer",
			"http://vandrico.com/device/heapsylon-sensoria-sock",
			"http://vandrico.com/device/hereo",
			"http://vandrico.com/device/hexoskin",
			"http://vandrico.com/device/h%C3%B6vding-airbag-cyclists",
			"http://vandrico.com/device/hxm-smart",
			"http://vandrico.com/device/i-limb-ultra",
			"http://vandrico.com/device/icedot-crash-sensor",
			"http://vandrico.com/device/ihealth-activity-and-sleep-tracker",
			"http://vandrico.com/device/ihealth-pulse-oximeter",
			"http://vandrico.com/device/imec-eeg-headset",
			"http://vandrico.com/device/infiniteye-virtual-reality-display",
			"http://vandrico.com/device/instabeat",
			"http://vandrico.com/device/intel-smartwatch",
			"http://vandrico.com/device/intelligent-headset",
			"http://vandrico.com/device/interaxon-muse",
			"http://vandrico.com/device/i%E2%80%99m-spa-i%E2%80%99m-watch",
			"http://vandrico.com/device/jawbone",
			"http://vandrico.com/device/jaybird-reign",
			"http://vandrico.com/device/kapture-audio-recording-wristband-watch",
			"http://vandrico.com/device/ki-fit",
			"http://vandrico.com/device/kiwi-move",
			"http://vandrico.com/device/kms-wristband",
			"http://vandrico.com/device/kreyos-meteor",
			"http://vandrico.com/device/laster-pro-mobile-display",
			"http://vandrico.com/device/lark-pro-wristband",
			"http://vandrico.com/device/lechal-shoe",
			"http://vandrico.com/device/lg-heart-rate-earphones",
			"http://vandrico.com/device/lg-lifeband-touch",
			"http://vandrico.com/device/logbar-ring",
			"http://vandrico.com/device/lumo-back",
			"http://vandrico.com/device/lumo-lift",
			"http://vandrico.com/device/lumus-dk-40",
			"http://vandrico.com/device/martian-watches",
			"http://vandrico.com/device/mbody-smart-system",
			"http://vandrico.com/device/memi-smartbracelet",
			"http://vandrico.com/device/meta-developer-edition",
			"http://vandrico.com/device/meta-pro",
			"http://vandrico.com/device/metawatch-frame",
			"http://vandrico.com/device/metawatch-strata",
			"http://vandrico.com/device/metria-ih1",
			"http://vandrico.com/device/mindwave",
			"http://vandrico.com/device/mio-alpha",
			"http://vandrico.com/device/mirama-digital-glasses",
			"http://vandrico.com/device/misfit-shine",
			"http://vandrico.com/device/moff",
			"http://vandrico.com/device/moov-activity-monitor",
			"http://vandrico.com/device/moticon-opengo-science",
			"http://vandrico.com/device/motorola-motoactv",
			"http://vandrico.com/device/mov-band",
			"http://vandrico.com/device/mykronoz-zenano",
			"http://vandrico.com/device/mykronoz-zewatch-zebracelet",
			"http://vandrico.com/device/narrative-clip",
			"http://vandrico.com/device/neptune-pine",
			"http://vandrico.com/device/nfc-ring",
			"http://vandrico.com/device/nike-fuelband-se",
			"http://vandrico.com/device/ntt-docomo-ar-walker",
			"http://vandrico.com/device/nuubo-necg-minder",
			"http://vandrico.com/device/nzn-lit",
			"http://vandrico.com/device/o-synce-screeneye-x",
			"http://vandrico.com/device/oculus-rift",
			"http://vandrico.com/device/omate-truesmart-watch",
			"http://vandrico.com/device/omg-autographer",
			"http://vandrico.com/device/omsignal",
			"http://vandrico.com/device/optalert-fatigue-management-glasses",
			"http://vandrico.com/device/optinvent-ora-s",
			"http://vandrico.com/device/orcam",
			"http://vandrico.com/device/owlet-baby-monitor",
			"http://vandrico.com/device/pebble-smartwatch",
			"http://vandrico.com/device/pebble-steel-smartwatch",
			"http://vandrico.com/device/peregrine",
			"http://vandrico.com/device/pfo-safety-bracelet",
			"http://vandrico.com/device/phyode-wme",
			"http://vandrico.com/device/polar-loop",
			"http://vandrico.com/device/polar-rcx5",
			"http://vandrico.com/device/porticool-2-system",
			"http://vandrico.com/device/preventice-bodyguardian",
			"http://vandrico.com/device/proteus-helius",
			"http://vandrico.com/device/push-fitness-tracker",
			"http://vandrico.com/device/qardio-qardioarm",
			"http://vandrico.com/device/qardio-qardiocore",
			"http://vandrico.com/device/qualcomm-toq",
			"http://vandrico.com/device/razer-nabu",
			"http://vandrico.com/device/recon-instruments-jet",
			"http://vandrico.com/device/recon-instruments-snow2",
			"http://vandrico.com/device/reemo",
			"http://vandrico.com/device/rest-devices-mimo",
			"http://vandrico.com/device/ringblingz-ring",
			"http://vandrico.com/device/run-n-read",
			"http://vandrico.com/device/samsung-gear",
			"http://vandrico.com/device/samsung-gear-2",
			"http://vandrico.com/device/samsung-gear-2-neo",
			"http://vandrico.com/device/samsung-gear-fit",
			"http://vandrico.com/device/sense-pro-dry-electrodes",
			"http://vandrico.com/device/sensible-baby-smart-one",
			"http://vandrico.com/device/sensoglove",
			"http://vandrico.com/device/sentimoto",
			"http://vandrico.com/device/seraphim-sense-angel-wristband",
			"http://vandrico.com/device/sigmo",
			"http://vandrico.com/device/skully-helmets",
			"http://vandrico.com/device/smi-eye-tracking-glasses",
			"http://vandrico.com/device/somaxis-myolink",
			"http://vandrico.com/device/sonostar-smartwatch",
			"http://vandrico.com/device/sony-core",
			"http://vandrico.com/device/sony-hmz-t3w-personal-3d-viewer",
			"http://vandrico.com/device/sony-smartwatch",
			"http://vandrico.com/device/sony-smartwatch-2",
			"http://vandrico.com/device/soundbite",
			"http://vandrico.com/device/spotnsave",
			"http://vandrico.com/device/sqord-powerpod",
			"http://vandrico.com/device/suunto-ambit",
			"http://vandrico.com/device/swap-watches",
			"http://vandrico.com/device/tware-tjacket",
			"http://vandrico.com/device/tagg-pet-tracker",
			"http://vandrico.com/device/tarsier-moveeye",
			"http://vandrico.com/device/taser-axon-flex",
			"http://vandrico.com/device/thalmic-labs-myo-armband",
			"http://vandrico.com/device/dash-bragi-llc",
			"http://vandrico.com/device/theatro",
			"http://vandrico.com/device/thumb-track",
			"http://vandrico.com/device/tn-games-3rd-space-vest",
			"http://vandrico.com/device/trax-gps-tracker",
			"http://vandrico.com/device/vigo-fatigue-monitor",
			"http://vandrico.com/device/visi-mobile",
			"http://vandrico.com/device/voyce-dog-monitor",
			"http://vandrico.com/device/vuzix-m2000ar",
			"http://vandrico.com/device/vuzix-m100-smart-glasses",
			"http://vandrico.com/device/wearit-smart-watch",
			"http://vandrico.com/device/wellograph-watch",
			"http://vandrico.com/device/withings-blood-pressure-monitor",
			"http://vandrico.com/device/withings-pulse",
			"http://vandrico.com/device/xensr",
			"http://vandrico.com/device/xybermind-achillex",
			"http://vandrico.com/device/zinc-zen-sensor",
			"http://vandrico.com/device/zio-xt-patch",
			"http://vandrico.com/device/zte-bluewatch",
			"http://vandrico.com/device/zypad-wl1500"
		]
	scraped_products = []

	def __init__(self):
		pass

	@staticmethod
	def fetch_page(url):
		''' GET web page located at url and return contents '''
		return urllib2.urlopen(url).read()

	@staticmethod
	def get_page_soup(page_content):
		''' Get all words in HTML '''
		return BeautifulSoup(page_content)

	@staticmethod
	def get_product_title(soup):
		return soup.find_all('h4')[0].contents[0].encode('utf-8')

	@staticmethod
	def get_body_locations(soup):
		alist = []
		for child in soup.find_all('h6')[0].children:
			if child.name == 'a':
				alist.append(child.contents[0].encode('utf-8'))
		return alist

	@staticmethod
	def get_primary_applications(soup):
		alist = []
		for child in soup.find_all('h6')[1].children:
			if child.name == 'a':
				alist.append(child.contents[0].encode('utf-8'))
		return alist

	@staticmethod
	def get_about(soup):
		about_header = soup.find_all('h5')[2]
		return about_header.next_sibling.encode('utf-8')

	@staticmethod
	def get_network(soup):
		alist = []
		for table in soup.find_all('table'):
			if table.get('class'):
				if str(table.get('class')[0]) == 'device-social-menu':
					for network in table.find_all('a'):
						alist.append(network.get("href").encode('utf-8'))
		return alist

	@staticmethod
	def get_power_source(soup):
		alist = []
		for child in soup.find_all('h5'):
			if child.contents[0] == 'Power Source':
				subchild = child
				count = 0
				if subchild.next_sibling:
					while count < 20:
						if subchild.next_sibling:
							if subchild.next_sibling.name != 'br':
								if subchild.next_sibling:
									if subchild.next_sibling.name == 'a':
										alist.append(subchild.next_sibling.contents[0].encode('utf-8'))
								subchild = subchild.next_sibling
							else:
								break
						count += 1
		return alist

	@staticmethod
	def get_componentry(soup):
		alist = []
		for child in soup.find_all('h5'):
			if child.contents[0] == 'Componentry':
				subchild = child
				count = 0
				if subchild.next_sibling:
					while count < 20:
						if subchild.next_sibling:
							if subchild.next_sibling.name != 'br':
								if subchild.next_sibling:
									if subchild.next_sibling.name == 'a':
										alist.append(subchild.next_sibling.contents[0].encode('utf-8'))
								subchild = subchild.next_sibling
							else:
								break
						count += 1
		return alist

	@staticmethod
	def get_connectivity(soup):
		alist = []
		for child in soup.find_all('h5'):
			if child.contents[0] == 'Connectivity':
				subchild = child
				count = 0
				if subchild.next_sibling:
					while count < 20:
						if subchild.next_sibling:
							if subchild.next_sibling.name != 'br':
								if subchild.next_sibling:
									if subchild.next_sibling.name == 'a':
										alist.append(subchild.next_sibling.contents[0].encode('utf-8'))
								subchild = subchild.next_sibling
							else:
								break
						count += 1
		return alist

	@staticmethod
	def get_compatibility(soup):
		alist = []
		for child in soup.find_all('h5'):
			if child.contents[0] == 'Compatibility':
				subchild = child
				count = 0
				if subchild.next_sibling:
					while count < 20:
						if subchild.next_sibling:
							if subchild.next_sibling.name != 'br':
								if subchild.next_sibling:
									if subchild.next_sibling.name == 'a':
										alist.append(subchild.next_sibling.contents[0].encode('utf-8'))
								subchild = subchild.next_sibling
							else:
								break
						count += 1
		return alist

	@staticmethod
	def get_potential_workplace_benefits(soup):
		alist = []
		for child in soup.find_all('h5'):
			if child.contents[0] == 'Potential Workplace Benefits':
				a = ""
				if child.next_sibling == '\n':
					a = child.next_sibling.next_sibling
				else:
					a = child.next_sibling
				alist.append(a.contents[0].encode('utf-8'))
		return alist

	@staticmethod
	def get_company(soup):
		alist = []
		for child in soup.find_all('h5'):
			if child.contents[0] == 'Company':
				a = ""
				if child.next_sibling == '\n':
					a = child.next_sibling.next_sibling
				else:
					a = child.next_sibling
				alist.append(a.contents[0].encode('utf-8').strip())
		return alist

	@staticmethod
	def get_device_name(soup):
		alist = []
		for child in soup.find_all('h5'):
			if child.contents[0] == 'Device Name':
				a = ""
				if child.next_sibling == '\n':
					a = child.next_sibling.next_sibling
				else:
					a = child.next_sibling
				alist.append(a.contents[0].encode('utf-8').strip())
		return alist

	@staticmethod
	def get_consumer_release(soup):
		alist = []
		for child in soup.find_all('h5'):
			if child.contents[0] == 'Consumer Release':
				a = ""
				if child.next_sibling == '\n':
					a = child.next_sibling.next_sibling
				else:
					a = child.next_sibling
				alist.append(a.contents[0].encode('utf-8').strip())
		return alist

	@staticmethod
	def get_price(soup):
		alist = []
		for child in soup.find_all('h5'):
			if child.contents[0] == 'Price':
				a = ""
				if child.next_sibling == '\n':
					a = child.next_sibling.next_sibling
				else:
					a = child.next_sibling
				alist.append(a.contents[0].encode('utf-8').strip())
		return alist

	@staticmethod
	def get_similar_devices(soup):
		alist = []
		for table in soup.find_all('table'):
			if table.get('class'):
				if str(table.get('class')[0]) == 'device-teaser':
					alist.append(table.find('h4').find('a').contents[0].encode('utf-8'))
		return alist

	@staticmethod
	def get_potential_workplace_benefits(soup):
		alist = []
		for child in soup.find_all('h5'):
			if child.contents[0] == 'Potential Workplace Benefits':
				a = ""
				if child.next_sibling == '\n':
					a = child.next_sibling.next_sibling
				else:
					a = child.next_sibling
				alist.append(a.contents[0].encode('utf-8'))
		return alist

	@staticmethod
	def get_image_name(soup):
		alist = []
		for div in soup.find_all('div'):
			if div.get('class'):
				if div.get('class')[0] == 'span3':
					for child in div.find_all('img'):
						url = child.get('src')
						image_name = url.replace('http://vandrico.com/sites/default/files/styles/large/public/','')
						f = open("scraped_images/" + image_name,'wb')
						f.write(urllib2.urlopen(url).read())
						f.close()
						alist.append(image_name.encode('utf-8'))
		return alist

	def scrape_fields(self, page_content, page_url):
		''' Scrape fields from the page.  This consists of finding the words in the 
		page HTML '''
		page_text = self.get_page_words(page_content)
		# split words by space or new line
		word_list = re.split('\s|\n', page_text)
		bad_chars = '.,()!?"-&'
		for word in word_list:
			# remove leading and trailing whitespace from word
			word = word.strip()
			# remove leading and trailing bad characters from each word
			for c in bad_chars:
				word = word.replace(c, "")
			if word != "":
				self.add_to_inverted_index(word, page_url)

	def start(self):
		for index, product_url in enumerate(self.product_urls):
			print product_url
			page = self.fetch_page(product_url)
			#file = open("/users/timothymeyers/projects/wearables/samplepage.txt", "r")
			soup = self.get_page_soup(page)
			scraped_product = { "id": (index+1) }
			scraped_product["title"] = self.get_product_title(soup)
			scraped_product["locations"] = self.get_body_locations(soup)
			scraped_product["primary_applications"] = self.get_primary_applications(soup)
			scraped_product["about"] = self.get_about(soup)
			scraped_product["network"] = self.get_network(soup)
			scraped_product["power_source"] = self.get_power_source(soup)
			scraped_product["componentry"] = self.get_componentry(soup)
			scraped_product["connectivity"] = self.get_connectivity(soup)
			scraped_product["compatibility"] = self.get_compatibility(soup)
			scraped_product["potential_workplace_benefits"] = self.get_potential_workplace_benefits(soup)
			scraped_product["company"] = self.get_company(soup)
			scraped_product["device_name"] = self.get_device_name(soup)
			scraped_product["consumer_release"] = self.get_consumer_release(soup)
			scraped_product["price"] = self.get_price(soup)
			scraped_product["similar_devices"] = self.get_similar_devices(soup)
			scraped_product["image_name"] = self.get_image_name(soup)
			self.scraped_products.append(scraped_product)
		file = open("/users/timothymeyers/projects/wearables/products.json", "w")
		print self.scraped_products
		file.write(json.dumps(self.scraped_products))

if __name__ == '__main__':
	crawler = Crawler()
	crawler.start()






