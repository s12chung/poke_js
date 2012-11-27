module PokeJs
  module ViewHelpers
    #http://stackoverflow.com/questions/339130/how-do-i-render-a-partial-of-a-different-format-in-rails
    def with_format(format, &block)
      old_formats = formats
      self.formats = [format]
      result = block.call
      self.formats = old_formats
      result
    end

    def poke_js_template
      extract_template(@poke_js_template)
    end

    def with_template(template)
      old_template = @poke_js_template
      @poke_js_template = template
      yield
      @poke_js_template = old_template
    end

    def poke(template=@poke_js_template, format=formats.first)
      controller, action = extract_template(template)
      poke_lambda = -> do
        if format == :html
          with_format(:js) do
            if lookup_context.template_exists? "#{controller}/#{action}_params"
              javascript_tag do
                raw %Q/
              APP.#{controller}.html.#{action}_params = #{ render :template => "#{controller}/#{action}_params" };
            /
              end
            end
          end
        elsif format == :js
          content_for :head do
            javascript_tag do
              render :template => "#{controller}/#{action}", :formats => [:js], :layout => "layouts/application"
            end
          end
        end
      end

      if template != @poke_js_template
        with_template(template) { poke_lambda.call }
      else
        poke_lambda.call
      end
    end

    private
    def extract_template(template)
      extracted_template = [controller_name, action_name]
      if template
        array = template.class == Array ? template : template.to_s.split('/')
        if array.size == 1
          extracted_template[1] = array.first
        else
          extracted_template = array
        end
      end
      extracted_template
    end
  end
end