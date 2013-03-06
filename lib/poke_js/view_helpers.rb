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

    def with_template(template)
      old_template = @poke_js_template
      @poke_js_template = template
      result = yield
      @poke_js_template = old_template
      result
    end

    def poke_js_params(template=@poke_js_template)
      controller, action = extract_template(template)
      raw "APP.#{controller.gsub("/", ".")}.#{request.format.symbol}.#{action}_params"
    end

    def define_poke_js_params(template=@poke_js_template)
      controller, action = extract_template(template)

      params  =  { controller: controller, action: action, method: request.method, path: request.env['PATH_INFO'], format: request.format.symbol }
      if self.respond_to? :add_params
        params.reverse_merge! add_params
      end
      javascript = params.to_json
      if block_given?
        if yield
          javascript = "$.extend(#{yield}, #{javascript});"
        end
      end
      raw javascript
    end

    def head_poke
      raw "#{source_poke}\n#{poke}"
    end

    def poke(template=@poke_js_template, format=formats.first)
      controller, action = extract_template(template)
      poke_lambda = -> do
        if format == :html
          with_format(:js) do
            javascript_tag do
              raw %Q/
                  POKE.create_namespace('#{poke_js_params}');
                  #{poke_js_params} = #{ define_poke_js_params do
                    if lookup_context.template_exists? "#{controller}/#{action}_params"
                      render(template: "#{controller}/#{action}_params")
                    end
                  end };
                  #{
                  if @source_poke
                    %Q/$(function() { POKE.exec_all(#{poke_js_params}); });/
                  else
                    %Q/
                      POKE.define('POKE', {
                      params: #{poke_js_params},
                          init: function() { POKE.exec_all(POKE.params); },
                      });
                      $(POKE.init);
                    /
                  end
                  }
                  /
            end
          end
        elsif format == :js
          content_for :head do
            javascript_tag do
              raw "$(function(){#{render template: "#{controller}/#{action}", formats: [:js], layout: "layouts/application"}});"
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

    def source_poke
      source_template = flash[:source_template]
      if source_template
        @source_poke = true
        result = poke source_template
        @source_poke = false
        result
      end
    end
  end
end