# Generates a WebP variant for every image produced by jekyll-responsive-image
# and exposes it to the templates as `webp_path`, so they can serve WebP via
# <picture> with the original JPEG/PNG as fallback.
require 'fileutils'
require 'tempfile'

module Jekyll
  module ResponsiveImage
    class ResizeHandler
      alias_method :resize_image_without_webp, :resize_image

      def resize_image
        resized = resize_image_without_webp

        resized.each do |image|
          next unless image['extension'] =~ /\A(jpe?g|png)\z/i

          webp_path = image['path'].sub(/\.#{image['extension']}\z/i, '.webp')
          source_filepath = File.expand_path(image['path'], @config[:site_source])
          webp_source_filepath = File.expand_path(webp_path, @config[:site_source])
          webp_dest_filepath = File.expand_path(webp_path, @config[:site_dest])

          temporary_webp = nil
          webp = nil
          begin
            ensure_output_dir_exists!(webp_source_filepath)
            ensure_output_dir_exists!(webp_dest_filepath)
            Jekyll.logger.info "Generating #{webp_source_filepath}"
            temporary_webp = Tempfile.new(['.responsive-image-', '.webp'], File.dirname(webp_source_filepath))
            temporary_webp.close
            webp = Magick::Image::read(source_filepath).first
            webp.write(temporary_webp.path) do |f|
              # WebP compresses more efficiently than JPEG, so keep quality
              # high (especially for fullscreen cover images).
              f.quality = @config['webp_quality'] || 90
            end
            FileUtils.mv(temporary_webp.path, webp_source_filepath)
            FileUtils.copy_file(webp_source_filepath, webp_dest_filepath)
          rescue StandardError => e
            raise "Failed to generate WebP from #{source_filepath} to #{webp_source_filepath} and #{webp_dest_filepath}: #{e.message}"
          ensure
            webp.destroy! if webp
            temporary_webp.unlink if temporary_webp
          end

          image['webp_path'] = webp_path
        end

        resized
      end
    end
  end
end
