require 'csv'
require 'json'

headers = %w(id url ratio caption userId credit photographer likes commentsCount)
rows = []
sources = {}

Dir.glob('unsplash/*.json').each do |filename|
  user_id = filename.split('/').last.sub(/\.json$/, '')
  data = JSON.parse(File.read(filename), symbolize_names: true)
  data.each do |photo|
    rows.push([
      rows.size + 1,
      "/photos/#{photo[:id]}.jpg",
      (photo[:width].to_f / photo[:height] * 100).round,
      'caption tbd',
      user_id,
      "https://unsplash.com/photos/#{photo[:id]}",
      photo[:user][:name],
      rand(10..10_000),
      0
    ])
    sources[photo[:id]] = photo[:urls][:regular]
  end
end

puts ([headers] + rows).map(&:to_csv).join
# sources.each { |id, url| puts `curl \"#{url}\" > public/photos/#{id}.jpg` }
