require 'test_helper'

class ResponsiveImageWebpTest < PluginTest
  RESIZED_PNG = 'assets/resized/photo-50x30.png'.freeze
  RESIZED_WEBP = 'assets/resized/photo-50x30.webp'.freeze

  def test_generates_a_webp_variant_next_to_every_resized_png
    resized = resize(create_source_image('photo.png'))

    assert_equal [RESIZED_PNG], resized.map { |image| image['path'] }
    assert_equal RESIZED_WEBP, resized.first['webp_path']

    assert File.exist?(source_path(RESIZED_WEBP)), 'expected the WebP variant in the site source'
    assert File.exist?(dest_path(RESIZED_WEBP)), 'expected the WebP variant in the site destination'
    assert_equal 'WEBP', image_format(source_path(RESIZED_WEBP))
  end

  def test_keeps_the_original_variant_as_a_fallback
    resize(create_source_image('photo.png'))

    assert File.exist?(source_path(RESIZED_PNG))
    assert_equal 'PNG', image_format(source_path(RESIZED_PNG))
  end

  def test_converts_jpegs_regardless_of_extension_case
    resized = resize(create_source_image('photo.JPG'))

    assert_equal 'assets/resized/photo-50x30.webp', resized.first['webp_path']
    assert File.exist?(source_path('assets/resized/photo-50x30.webp'))
  end

  def test_ignores_formats_that_are_not_jpeg_or_png
    resized = resize(create_source_image('photo.gif'))

    assert_equal 'gif', resized.first['extension']
    assert_nil resized.first['webp_path']
    refute File.exist?(source_path('assets/resized/photo-50x30.webp'))
  end

  def test_webp_quality_is_configurable
    low_quality_size = webp_size_for_quality(5)
    high_quality_size = webp_size_for_quality(95)

    assert_operator low_quality_size * 2, :<, high_quality_size
  end

  def test_does_not_regenerate_an_existing_webp_variant
    image_path = create_source_image('photo.png')
    write_file(source_path(RESIZED_WEBP), 'cached webp')

    resized = resize(image_path)

    assert_equal 'cached webp', File.read(source_path(RESIZED_WEBP))
    assert_equal 'cached webp', File.read(dest_path(RESIZED_WEBP))
    assert_equal RESIZED_WEBP, resized.first['webp_path']
  end

  def test_does_not_overwrite_a_webp_variant_in_the_destination
    image_path = create_source_image('photo.png')
    write_file(source_path(RESIZED_WEBP), 'source webp')
    write_file(dest_path(RESIZED_WEBP), 'published webp')

    resize(image_path)

    assert_equal 'published webp', File.read(dest_path(RESIZED_WEBP))
  end

  private

  # A wider variant keeps the size difference between quality settings well
  # above encoder-version noise.
  def webp_size_for_quality(quality)
    resize(
      create_source_image('photo.png'),
      'webp_quality' => quality,
      'sizes' => [{ 'width' => 200 }]
    )

    File.size(source_path('assets/resized/photo-200x120.webp'))
  ensure
    FileUtils.remove_entry(@tmpdir) if @tmpdir
    @tmpdir = nil
  end

  def write_file(path, contents)
    FileUtils.mkdir_p(File.dirname(path))
    File.write(path, contents)
  end
end
