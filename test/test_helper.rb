require 'simplecov'

SimpleCov.start do
  add_filter %r{\A/test/}
  track_files '_plugins/**/*.rb'
end

require 'minitest/autorun'
require 'tmpdir'
require 'fileutils'
require 'jekyll'
require 'jekyll-responsive-image'

# The plugins are monkey patches on top of jekyll-responsive-image, so they have
# to be loaded after the gem.
Dir[File.expand_path('../_plugins/**/*.rb', __dir__)].sort.each { |plugin| require plugin }

Jekyll.logger.log_level = :error

module PluginTestHelpers
  RESPONSIVE_IMAGE_DEFAULTS = Jekyll::ResponsiveImage::Config::DEFAULTS

  # Config as jekyll-responsive-image builds it, pointing at a throwaway site.
  def responsive_image_config(overrides = {})
    RESPONSIVE_IMAGE_DEFAULTS.merge(
      'sizes' => [{ 'width' => 50 }],
      site_source: site_source,
      site_dest: site_dest
    ).merge(overrides)
  end

  def site_source
    File.join(tmpdir, 'source')
  end

  def site_dest
    File.join(tmpdir, 'dest')
  end

  def tmpdir
    @tmpdir ||= Dir.mktmpdir('responsive-image-test')
  end

  # Writes a photo-like image so that lossy encoders produce meaningfully
  # different file sizes for different quality settings.
  def create_source_image(basename, width: 400, height: 240)
    path = File.join(site_source, 'assets', basename)
    FileUtils.mkdir_p(File.dirname(path))

    image = Magick::Image.read('plasma:fractal') { |info| info.size = "#{width}x#{height}" }.first
    image.write(path)
    image.destroy!

    path
  end

  def resize(image_path, config_overrides = {})
    config = responsive_image_config(config_overrides)
    Jekyll::ResponsiveImage::ResizeHandler.new(image_path, config).resize_image
  end

  def source_path(relative_path)
    File.join(site_source, relative_path)
  end

  def dest_path(relative_path)
    File.join(site_dest, relative_path)
  end

  def image_format(path)
    image = Magick::Image.ping(path).first
    format = image.format
    image.destroy!
    format
  end
end

class PluginTest < Minitest::Test
  include PluginTestHelpers

  def teardown
    FileUtils.remove_entry(@tmpdir) if @tmpdir && Dir.exist?(@tmpdir)
  end
end
